# TaskCampus - Technical Spec

## Stack
- Frontend: Vite + TypeScript + Tailwind.
- Backend: FastAPI (Python).
- Persistencia: JSON local y opcion de Supabase.

## Modelo de datos
- id (uuid)
- title
- description
- subject
- due_date (YYYY-MM-DD)
- priority (low | medium | high)
- status (pending | in_progress | finished)
- created_at (ISO)
- updated_at (ISO)

## API REST
- GET /tasks
  - Query: status, priority, subject
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}
- GET /summary

## Persistencia
- JSON en backend/data/tasks.json.
- Supabase opcional con variables:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_TABLE

## CORS
- Permitir origenes para consumo desde el frontend.

## Deployment
- Frontend en GitHub Pages (gh-pages).
- Backend local o en hosting externo.
