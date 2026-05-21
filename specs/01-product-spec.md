# Product Spec - Pokedex Atlas

## Problema
Quiero una app simple que consuma una API publica y permita explorar datos con un flujo claro.

## Objetivos
- Mostrar una lista de pokemon con busqueda por nombre.
- Visualizar detalle del pokemon seleccionado con stats y tipos.
- Guardar un equipo local con favoritos.

## No objetivos
- Autenticacion de usuarios.
- Busqueda avanzada por tipo, region o habilidad.
- Persistencia en backend.

## Usuarios
- Estudiantes que necesitan un ejemplo de consumo de API.
- Usuarios curiosos que quieren explorar pokemon rapido.

## Historias de usuario
1. Como usuario, quiero ver una lista de pokemon con su ID e imagen para elegir rapido.
2. Como usuario, quiero abrir el detalle para ver stats y tipos.
3. Como usuario, quiero guardar favoritos en un equipo local.
4. Como usuario, quiero volver facil a la lista.

## Criterios de aceptacion
- La lista se carga desde PokeAPI sin recargar la pagina.
- La busqueda filtra por nombre en tiempo real.
- El detalle muestra imagen oficial, tipos, altura, peso, habilidades y stats.
- El equipo se guarda en localStorage y persiste al recargar.
- La UI muestra estados de carga y error.
