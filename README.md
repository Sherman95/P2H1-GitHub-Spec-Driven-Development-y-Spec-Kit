# TaskCampus

Plataforma web moderna para gestionar tareas y asignaturas con autenticacion JWT, backend en FastAPI y frontend en TypeScript. Desarrollada con Spec Driven Development y GitHub Spec Kit.

## Arquitectura
Frontend (Vite + TypeScript + Tailwind)
   -> FastAPI REST API
   -> Supabase PostgreSQL

## Estructura
- specs/: especificaciones, plan tecnico y plan de tareas.
- frontend/: Vite + TypeScript + Tailwind.
- backend/: FastAPI + Supabase PostgreSQL + JWT.

## Funcionalidades clave
- Registro y login con JWT.
- CRUD de asignaturas y tareas.
- Filtros avanzados, busqueda y ordenamiento.
- Dashboard con resumen y graficos simples.
- Tareas vencidas con estado overdue.
- Dark mode con persistencia.
- Fallback localStorage cuando el backend no responde.

## Stack
- Frontend: Vite, TypeScript, TailwindCSS.
- Backend: FastAPI, Pydantic, JWT, Supabase SDK.
- DB: PostgreSQL (Supabase).

## Requisitos
- Node.js 18+
- Python 3.11+

## Backend (FastAPI)
1. Crear entorno virtual y activar.
2. Instalar dependencias:
   - pip install -r requirements.txt
3. Configurar variables de entorno:
   - Copiar backend/.env.example a backend/.env
4. Ejecutar:
   - uvicorn app.main:app --reload --port 8000

### Variables de entorno (backend/.env)
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

### SQL oficial Supabase
```sql
create extension if not exists "pgcrypto";

create table if not exists users (
   id uuid primary key default gen_random_uuid(),
   full_name text not null,
   email text unique not null,
   password_hash text not null,
   created_at timestamptz not null default now()
);

create table if not exists subjects (
   id uuid primary key default gen_random_uuid(),
   user_id uuid not null references users(id) on delete cascade,
   name text not null,
   teacher text,
   color text default '#3B82F6',
   created_at timestamptz not null default now()
);

create table if not exists tasks (
   id uuid primary key default gen_random_uuid(),
   user_id uuid not null references users(id) on delete cascade,
   subject_id uuid references subjects(id) on delete set null,
   title text not null,
   description text,
   due_date date not null,
   priority text not null check (priority in ('low', 'medium', 'high')),
   status text not null check (status in ('pending', 'in_progress', 'completed', 'overdue')),
   created_at timestamptz not null default now(),
   updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_tasks_subject_id on tasks(subject_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_priority on tasks(priority);
create index if not exists idx_subjects_user_id on subjects(user_id);
```

## Frontend (Vite)
1. Entrar a frontend/ e instalar dependencias:
   - npm install
2. Configurar API base:
   - Copiar frontend/.env.example a frontend/.env
3. Ejecutar:
   - npm run dev

### Variables de entorno (frontend/.env)
VITE_API_BASE_URL=http://localhost:8000

## GitHub Pages (gh-pages)
1. Entrar a frontend/ y ejecutar:
   - npm run deploy
2. En GitHub: Settings -> Pages -> Branch: gh-pages / root.

> Nota: En GitHub Pages el frontend funciona en modo local (localStorage) si no hay backend disponible.

## Endpoints disponibles
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
- GET /tasks/{id}
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}
- GET /tasks/summary

## Swagger
- http://localhost:8000/docs

## Integrantes
- AZUERO MALDONADO RONALD ALEJANDRO

## Evidencia de ramas y pull requests
- Crear ramas por fase (por ejemplo: feature/specs, feature/backend, feature/frontend).
- Abrir pull requests en GitHub y documentar los merges en el historial.
- Adjuntar el enlace del repositorio como evidencia.

## Capturas
- Agregar capturas de login, dashboard, tareas y dark mode.

## Flujo Spec Kit (CLI)
1. Instalar Specify CLI:
   - uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
2. Inicializar proyecto:
   - specify init taskcampus --integration copilot
3. Crear principios del proyecto:
   - /speckit.constitution
4. Definir especificacion funcional:
   - /speckit.specify
5. Plan tecnico:
   - /speckit.plan
6. Plan de tareas:
   - /speckit.tasks
7. Implementacion:
   - /speckit.implement
8. (Opcional) Verificacion:
   - /speckit.analyze
   - /speckit.checklist

## Especificaciones
- specs/01-product-spec.md
- specs/02-ux-spec.md
- specs/03-technical-spec.md
- specs/04-task-plan.md
- specs/taskcampus-spec.md
