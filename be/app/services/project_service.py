from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.models import TravelProject, ProjectPlace
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.services import artic_service


async def create_project(db: Session, data: ProjectCreate) -> TravelProject:
    """Create a project, optionally inserting places atomically."""
    place_ids = data.places or []

    if len(place_ids) > 10:
        raise HTTPException(status_code=400, detail="A project can have at most 10 places.")

    if len(place_ids) != len(set(place_ids)):
        raise HTTPException(status_code=409, detail="Duplicate place IDs in the request.")

    artworks = []
    for external_id in place_ids:
        artwork = await artic_service.get_artwork(external_id)
        if artwork is None:
            raise HTTPException(
                status_code=422,
                detail=f"Artwork with ID {external_id} was not found in the Art Institute API.",
            )
        artworks.append(artwork)

    project = TravelProject(
        name=data.name,
        description=data.description,
        start_date=data.start_date,
    )
    db.add(project)
    db.flush()  # obtain project.id without committing

    for artwork in artworks:
        db.add(ProjectPlace(
            project_id=project.id,
            external_id=artwork["id"],
            title=artwork["title"],
            image_url=artwork["image_url"],
        ))

    db.commit()
    db.refresh(project)
    return project


def get_projects(db: Session, page: int = 1, limit: int = 10) -> dict:
    offset = (page - 1) * limit
    total = db.query(func.count(TravelProject.id)).scalar()
    items = (
        db.query(TravelProject)
        .order_by(TravelProject.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {"items": items, "total": total, "page": page, "limit": limit}


def get_project(db: Session, project_id: int) -> TravelProject:
    project = db.query(TravelProject).filter(TravelProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return project


def update_project(db: Session, project_id: int, data: ProjectUpdate) -> TravelProject:
    project = get_project(db, project_id)
    if data.name is not None:
        project.name = data.name
    if data.description is not None:
        project.description = data.description
    if data.start_date is not None:
        project.start_date = data.start_date
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int) -> None:
    """Blocked if any place within the project is marked as visited."""
    project = get_project(db, project_id)

    if any(p.is_visited for p in project.places):
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a project that has visited places.",
        )

    db.delete(project)
    db.commit()
