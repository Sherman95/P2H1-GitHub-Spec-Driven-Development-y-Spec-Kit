# TaskCampus - Product Spec

## Problema
Los estudiantes necesitan una plataforma moderna para gestionar tareas, asignaturas y estados de avance con autenticacion segura y persistencia real.

## Objetivo
Evolucionar TaskCampus a una plataforma web escalable con arquitectura desacoplada, API REST profesional y UX moderna, siguiendo Spec Driven Development y Spec Kit.

## Usuarios
Estudiantes universitarios con multiples asignaturas y tareas.

## Alcance funcional
- Autenticacion JWT: registro, login y perfil.
- CRUD de asignaturas (subjects).
- CRUD de tareas asociadas a usuario y asignatura.
- Filtros avanzados y busqueda global.
- Ordenamiento por fecha, prioridad y estado.
- Resumen estadistico para dashboard.
- Modo oscuro y UI responsive.
- Persistencia offline cuando no hay API.

## Historias de usuario
- Como estudiante quiero registrarme e iniciar sesion para proteger mis tareas.
- Como estudiante quiero gestionar mis asignaturas para clasificar mis tareas.
- Como estudiante quiero crear tareas con prioridad y fecha para planificar.
- Como estudiante quiero filtrar y ordenar tareas para enfocarme.
- Como estudiante quiero ver un dashboard con estadisticas.
- Como estudiante quiero usar modo oscuro y ver la app en movil.

## Criterios de aceptacion
- Registro y login funcionan con JWT y contraseñas hasheadas.
- CRUD completo de asignaturas y tareas.
- Filtros por estado, prioridad, asignatura, busqueda y ordenamiento.
- Tareas vencidas se marcan como overdue automaticamente.
- Dashboard muestra conteos y graficos basicos.
- UI responsive con dark mode persistido.
- Fallback localStorage si el backend no responde.

## Fuera de alcance
- Notificaciones push.
- Integraciones externas (calendario, correo).
- Roles administrativos.
