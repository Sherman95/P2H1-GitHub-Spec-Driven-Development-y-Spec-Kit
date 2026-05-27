# Plan tecnico

## Arquitectura
- Frontend: Vite + TypeScript + Tailwind (SPA).
- Backend: FastAPI con persistencia en JSON local y opcion de Supabase.
- Comunicacion: API REST JSON.

## Modelo de datos (Task)
- id (uuid)
- title
- description
- subject
- due_date (YYYY-MM-DD)
- priority (low | medium | high)
- status (pending | in_progress | finished)
- created_at (ISO)
- updated_at (ISO)

## Endpoints
- GET /tasks
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}
- GET /summary

## Persistencia
- JSON local en backend/data/tasks.json.
- Supabase opcional mediante variables de entorno.

## Despliegue
- Frontend en GitHub Pages (gh-pages).
- Backend ejecuta local o en un hosting aparte si se desea.
