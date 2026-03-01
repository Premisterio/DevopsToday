from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PlaceInProject(BaseModel):
    id: int
    external_id: int
    title: str
    image_url: Optional[str] = None
    notes: Optional[str] = None
    is_visited: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    start_date: Optional[date] = None
    places: Optional[List[int]] = Field(default_factory=list)


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    start_date: Optional[date] = None


class ProjectListItem(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    is_completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    is_completed: bool
    created_at: datetime
    places: List[PlaceInProject] = []

    model_config = {"from_attributes": True}


class PaginatedProjects(BaseModel):
    items: List[ProjectListItem]
    total: int
    page: int
    limit: int
