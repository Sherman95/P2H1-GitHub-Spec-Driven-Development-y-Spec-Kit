# TaskCampus - Technical Spec

## Stack
- Frontend: Vite + TypeScript + Tailwind (Vanilla TS).
- Backend: FastAPI (Python 3.11+) con Pydantic.
- Auth: JWT (python-jose) + bcrypt.
- Persistencia: Supabase PostgreSQL.
- Fallback offline: localStorage.

## Arquitectura
- Frontend desacoplado.
- API REST con routers, services y repositories.
- Configuracion via .env.

## Modelo de datos
Users
- id, full_name, email, password_hash, created_at
Subjects
- id, user_id, name, teacher, color, created_at
Tasks
- id, user_id, subject_id, title, description, due_date
- priority: low | medium | high
- status: pending | in_progress | completed | overdue
- created_at, updated_at

## API REST
Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me

Subjects
- GET /subjects
- GET /subjects/{id}
- POST /subjects
- PUT /subjects/{id}
- DELETE /subjects/{id}

Tasks
- GET /tasks
  - Query: status, priority, subject_id, search, sort
- GET /tasks/{id}
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}
- GET /summary

## Reglas de negocio
- Si due_date < hoy y status != completed, marcar overdue.
- Validacion de enums y campos obligatorios.

## Persistencia
- Supabase con variables:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
- JWT:
  - JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

## Documentacion
- Swagger en /docs con schemas y status codes.

## Deployment
- Frontend en GitHub Pages.
- Backend en Render/Railway/Fly.io.
