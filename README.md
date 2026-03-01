# Travel Planner

A full-stack CRUD application for managing travel projects and places sourced from the **Art Institute of Chicago API**.

Users create travel projects (collections of artworks they want to visit), add notes, and mark places as visited. When all places in a project are visited the project is automatically marked as completed.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, SQLAlchemy, SQLite, Pydantic v2, httpx |
| Frontend | Next.js (JavaScript), Bootstrap 5, Axios |
| DevOps | Docker, Docker Compose |

## Quick Start (Docker Compose)

```bash
git clone <repo-url>
cd DevelopsToday
docker compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Quick Start (Local)

**Backend** (Python 3.11+ required):

```bash
cd be
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (Node.js 20+ required):

```bash
cd fe
npm install
npm run dev
```

Open http://localhost:3000 — the backend must be running on port 8000.

## Project Structure

```
.
├── docker-compose.yml      # Orchestrates both services
├── be/                     # Backend (FastAPI) — see be/README.md
│   ├── app/
│   │   ├── main.py         # App init, CORS, router registration
│   │   ├── database.py     # SQLAlchemy engine & session
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic & API client
│   │   └── dependencies.py # FastAPI dependencies
│   ├── requirements.txt
│   └── Dockerfile
└── fe/                     # Frontend (Next.js) — see fe/README.md
    ├── app/                # Next.js App Router pages
    ├── components/         # React components
    ├── lib/api.js          # Axios API client
    ├── package.json
    └── Dockerfile
```

For detailed setup, environment variables, and examples see the service-specific READMEs:

- [**Backend README**](be/README.md)
- [**Frontend README**](fe/README.md)

## API Endpoints

### Projects — `/projects`

| Method | Path | Description |
|---|---|---|
| `POST` | `/projects` | Create a project (optionally with places) |
| `GET` | `/projects?page=1&limit=10` | List all projects (paginated) |
| `GET` | `/projects/{id}` | Get a single project with its places |
| `PUT` | `/projects/{id}` | Update project name, description, start date |
| `DELETE` | `/projects/{id}` | Delete project (blocked if any place is visited) |

### Places — `/projects/{project_id}/places`

| Method | Path | Description |
|---|---|---|
| `POST` | `/projects/{project_id}/places` | Add a place to a project |
| `GET` | `/projects/{project_id}/places` | List all places in a project |
| `GET` | `/projects/{project_id}/places/{place_id}` | Get a single place |
| `PATCH` | `/projects/{project_id}/places/{place_id}` | Update notes and/or mark as visited |

## Third-Party API

Places are sourced from the **Art Institute of Chicago API** (`https://api.artic.edu/api/v1`). Each place is validated against this API before being stored. Responses are cached in-memory to reduce redundant calls.

## Business Rules

- **Max 10 places per project**
- **No duplicate places** within the same project
- **Artwork validation** — every place is verified against the Art Institute API before insertion
- **Cannot delete** a project that has any visited places
- **Auto-complete** — when all places are marked visited, the project is automatically completed

## Environment Variables

| Variable | Service | Default | Description |
|---|---|---|---|
| `ARTIC_API_BASE_URL` | Backend | `https://api.artic.edu/api/v1` | Art Institute API base URL |
| `DATABASE_URL` | Backend | `sqlite:///./travel.db` | SQLAlchemy database URL |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8000` | Backend API URL |
