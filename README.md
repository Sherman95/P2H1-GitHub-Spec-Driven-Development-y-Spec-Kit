# TaskCampus

Aplicacion web para gestionar tareas academicas con enfoque Spec Driven Development y Spec Kit.

## Estructura
- specs/: especificaciones, plan tecnico y plan de tareas.
- frontend/: Vite + TypeScript + Tailwind.
- backend/: FastAPI + persistencia JSON con opcion de Supabase.

## Requisitos
- Node.js 18+
- Python 3.11+

## Backend (FastAPI)
1. Crear entorno virtual y activar.
2. Instalar dependencias:
   - pip install -r requirements.txt
3. (Opcional) Configurar Supabase:
   - Copiar backend/.env.example a backend/.env
   - Completar SUPABASE_URL y SUPABASE_ANON_KEY
4. Ejecutar:
   - uvicorn app.main:app --reload --port 8000

### Tabla Supabase sugerida
```sql
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  subject text not null,
  due_date date not null,
  priority text not null,
  status text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);
```

## Frontend (Vite)
1. Entrar a frontend/ e instalar dependencias:
   - npm install
2. (Opcional) API base:
   - Copiar frontend/.env.example a frontend/.env
3. Ejecutar:
   - npm run dev

## GitHub Pages (gh-pages)
1. Entrar a frontend/ y ejecutar:
   - npm run deploy
2. En GitHub: Settings -> Pages -> Branch: gh-pages / root.

> Nota: En GitHub Pages el frontend funciona en modo local (localStorage) si no hay backend disponible.

## Endpoints disponibles
- GET /tasks
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}
- GET /summary

## Integrantes
- AZUERO MALDONADO RONALD ALEJANDRO

## Evidencia de ramas y pull requests
- Crear ramas por fase (por ejemplo: feature/specs, feature/backend, feature/frontend).
- Abrir pull requests en GitHub y documentar los merges en el historial.
- Adjuntar el enlace del repositorio como evidencia.

## Especificaciones
- specs/01-product-spec.md
- specs/02-ux-spec.md
- specs/03-technical-spec.md
- specs/04-task-plan.md
- specs/taskcampus-spec.md
