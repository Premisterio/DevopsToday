from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PlaceCreate(BaseModel):
    external_id: int = Field(..., gt=0)


class PlaceUpdate(BaseModel):
    notes: Optional[str] = None
    is_visited: Optional[bool] = None


class PlaceResponse(BaseModel):
    id: int
    project_id: int
    external_id: int
    title: str
    image_url: Optional[str] = None
    notes: Optional[str] = None
    is_visited: bool
    created_at: datetime

    model_config = {"from_attributes": True}
