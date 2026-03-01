from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
import app.models.models  # noqa: F401 — registers models with Base before create_all
from app.routers import places, projects


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Travel Planner API",
    description="CRUD API for managing travel projects and Art Institute of Chicago places.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(projects.router)
app.include_router(places.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
