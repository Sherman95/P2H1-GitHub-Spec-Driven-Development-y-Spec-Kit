# Especificacion del sistema TaskCampus

## Problema
Los estudiantes necesitan gestionar tareas y asignaturas en una plataforma segura, moderna y con persistencia real.

## Objetivo
Construir una aplicacion web con autenticacion JWT, CRUD completo y dashboard, siguiendo Spec Driven Development.

## Usuarios
Estudiantes universitarios.

## Alcance funcional
- Registro y login con JWT.
- CRUD de asignaturas.
- CRUD de tareas con filtros avanzados.
- Resumen y dashboard.
- Dark mode y UI responsive.
- Fallback offline si el backend no esta disponible.

## Reglas de negocio
- Prioridad: low, medium, high.
- Estado: pending, in_progress, completed, overdue.
- Si due_date < hoy y status != completed, marcar overdue.
