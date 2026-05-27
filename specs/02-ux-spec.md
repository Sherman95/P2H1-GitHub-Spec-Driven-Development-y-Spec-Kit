# TaskCampus - UX Spec

## Objetivos de UX
- Experiencia moderna, limpia y responsive.
- Flujos claros para autenticacion y gestion de tareas.
- Visibilidad inmediata de prioridades, vencidas y progreso.

## Estructura de la interfaz
- Pantallas de login y registro.
- Navbar con toggle de dark mode.
- Dashboard con tarjetas y graficos.
- Modulo de asignaturas (listado y formulario).
- Modulo de tareas (listado, filtros, busqueda, formulario).
- Estado de conexion y modo offline.

## Flujos principales
1. Registro y login.
2. Crear y gestionar asignaturas.
3. Crear, editar y eliminar tareas.
4. Filtrar, buscar y ordenar tareas.
5. Revisar dashboard con resumen.

## Estados de la UI
- Loading.
- Error de conexion.
- Empty state para tareas y asignaturas.
- Confirmacion al eliminar.

## Dark mode
- Persistir en localStorage (clave theme).
- Fallback a preferencia del sistema.
- Componentes compatibles: navbar, cards, formularios, tablas.

## Accesibilidad basica
- Inputs con labels.
- Contrastes legibles en ambos temas.
