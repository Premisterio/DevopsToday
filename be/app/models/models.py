from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class TravelProject(Base):
    __tablename__ = "travel_projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    places = relationship(
        "ProjectPlace",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="select",
    )


class ProjectPlace(Base):
    __tablename__ = "project_places"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(
        Integer,
        ForeignKey("travel_projects.id", ondelete="CASCADE"),
        nullable=False,
    )
    external_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_visited = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("TravelProject", back_populates="places")

    __table_args__ = (
        UniqueConstraint("project_id", "external_id", name="uq_project_external_id"),
    )
