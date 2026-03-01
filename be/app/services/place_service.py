from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.models import ProjectPlace, TravelProject
from app.schemas.place import PlaceCreate, PlaceUpdate
from app.services import artic_service

MAX_PLACES_PER_PROJECT = 10


async def add_place(db: Session, project_id: int, data: PlaceCreate) -> ProjectPlace:
    """Add an artwork to a project after validating it against the Art Institute API."""
    project = db.query(TravelProject).filter(TravelProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    count = db.query(ProjectPlace).filter(ProjectPlace.project_id == project_id).count()
    if count >= MAX_PLACES_PER_PROJECT:
        raise HTTPException(
            status_code=400,
            detail=f"Project already has the maximum of {MAX_PLACES_PER_PROJECT} places.",
        )

    existing = (
        db.query(ProjectPlace)
        .filter(
            ProjectPlace.project_id == project_id,
            ProjectPlace.external_id == data.external_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="This place is already in the project.")

    artwork = await artic_service.get_artwork(data.external_id)
    if artwork is None:
        raise HTTPException(
            status_code=422,
            detail=f"Artwork with ID {data.external_id} was not found in the Art Institute API.",
        )

    place = ProjectPlace(
        project_id=project_id,
        external_id=data.external_id,
        title=artwork["title"],
        image_url=artwork["image_url"],
    )
    db.add(place)
    db.commit()
    db.refresh(place)
    return place


def get_places(db: Session, project_id: int) -> list[ProjectPlace]:
    project = db.query(TravelProject).filter(TravelProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return db.query(ProjectPlace).filter(ProjectPlace.project_id == project_id).all()


def get_place(db: Session, project_id: int, place_id: int) -> ProjectPlace:
    place = (
        db.query(ProjectPlace)
        .filter(ProjectPlace.project_id == project_id, ProjectPlace.id == place_id)
        .first()
    )
    if not place:
        raise HTTPException(status_code=404, detail="Place not found.")
    return place


def update_place(db: Session, project_id: int, place_id: int, data: PlaceUpdate) -> ProjectPlace:
    """When all places in the project are visited, auto-completes the project."""
    place = get_place(db, project_id, place_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(place, field, value)

    db.flush()

    # Auto-complete project when all places are visited
    if update_data.get("is_visited") is True:
        project = db.query(TravelProject).filter(TravelProject.id == project_id).first()
        if project and project.places and all(p.is_visited for p in project.places):
            project.is_completed = True

    db.commit()
    db.refresh(place)
    return place
