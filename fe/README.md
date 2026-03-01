# Travel Planner — Frontend

Next.js 14 frontend for browsing and managing travel projects backed by artworks from the Art Institute of Chicago.

## Running locally (without Docker)

**Requirements:** Node.js 20+

```bash
cd fe
npm install
npm run dev
```

App is available at `http://localhost:3000`.

The backend must be running at `http://localhost:8000` (or set `NEXT_PUBLIC_API_URL`).

## Running with Docker Compose (from the repo root)

```bash
docker compose up --build
```

This starts both the backend (port 8000) and the frontend (port 3000).

## Running with Docker only

```bash
cd fe
docker build -t travel-planner-fe .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 travel-planner-fe
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the Travel Planner backend API |

## Pages

| Path | Description |
|---|---|
| `/` | Projects list — create, view, and delete travel projects |
| `/projects/:id` | Project detail — manage places, add notes, mark as visited |
