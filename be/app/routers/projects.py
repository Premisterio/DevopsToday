from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.project import (
    PaginatedProjects,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new travel project, optionally with an initial list of places."""
    return await project_service.create_project(db, data)


@router.get("", response_model=PaginatedProjects, status_code=status.HTTP_200_OK)
def list_projects(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    """List all projects with pagination (page / limit query params)."""
    return project_service.get_projects(db, page, limit)


@router.get("/{project_id}", response_model=ProjectResponse, status_code=status.HTTP_200_OK)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Retrieve a single project with all its places."""
    return project_service.get_project(db, project_id)


@router.put("/{project_id}", response_model=ProjectResponse, status_code=status.HTTP_200_OK)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    """Update project metadata (name, description, start_date)."""
    return project_service.update_project(db, project_id, data)


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project. Blocked if any place is already visited."""
    project_service.delete_project(db, project_id)
    return {"message": "Project deleted successfully."}
