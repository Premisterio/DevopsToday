from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.place import PlaceCreate, PlaceResponse, PlaceUpdate
from app.services import place_service

router = APIRouter(prefix="/projects/{project_id}/places", tags=["places"])


@router.post("", response_model=PlaceResponse, status_code=status.HTTP_201_CREATED)
async def add_place(project_id: int, data: PlaceCreate, db: Session = Depends(get_db)):
    """Add an artwork place to a project (validates against Art Institute API)."""
    return await place_service.add_place(db, project_id, data)


@router.get("", response_model=List[PlaceResponse], status_code=status.HTTP_200_OK)
def list_places(project_id: int, db: Session = Depends(get_db)):
    """List all places in a project."""
    return place_service.get_places(db, project_id)


@router.get("/{place_id}", response_model=PlaceResponse, status_code=status.HTTP_200_OK)
def get_place(project_id: int, place_id: int, db: Session = Depends(get_db)):
    """Retrieve a single place within a project."""
    return place_service.get_place(db, project_id, place_id)


@router.patch("/{place_id}", response_model=PlaceResponse, status_code=status.HTTP_200_OK)
def update_place(
    project_id: int,
    place_id: int,
    data: PlaceUpdate,
    db: Session = Depends(get_db),
):
    """Update notes and/or mark a place as visited."""
    return place_service.update_place(db, project_id, place_id, data)
