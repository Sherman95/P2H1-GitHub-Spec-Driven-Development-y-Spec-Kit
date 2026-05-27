# TaskCampus - UX Spec

## Objetivos de UX
- Captura rapida de tareas.
- Visibilidad clara de prioridades y estados.
- Filtros simples y efectivos.

## Estructura de la interfaz
- Header con titulo y estado de conexion.
- Resumen con 4 tarjetas (total, pendientes, finalizadas, alta prioridad).
- Lista de tareas con acciones de editar y eliminar.
- Formulario para crear o actualizar tareas.

## Flujos principales
1. Crear tarea
   - Completar formulario y guardar.
2. Editar tarea
   - Seleccionar editar, cargar datos en formulario, actualizar.
3. Eliminar tarea
   - Seleccionar eliminar y refrescar lista.
4. Filtrar tareas
   - Usar filtros por estado, prioridad y asignatura.

## Estados de la UI
- Cargando tareas (mensaje breve o esqueleto simple).
- Lista vacia con mensaje informativo.
- Modo local cuando no hay backend.

## Accesibilidad basica
- Inputs con labels.
- Contraste legible en tarjetas y botones.
