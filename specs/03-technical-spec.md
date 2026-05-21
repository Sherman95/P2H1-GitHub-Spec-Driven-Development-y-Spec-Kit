# Technical Spec - Pokedex Atlas

## Stack
- React + Vite
- Fetch API
- localStorage

## Data Sources
- Lista: https://pokeapi.co/api/v2/pokemon?limit=60
- Detalle: https://pokeapi.co/api/v2/pokemon/{id}
- Sprites: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png

## Estado principal
- view: tab actual
- list: lista de pokemon
- selectedId: pokemon elegido
- detail: datos del pokemon
- team: arreglo persistido en localStorage
- loading + error

## Persistencia
- localStorage key: p2h1-team

## Manejo de errores
- Mensaje amigable si falla la lista o detalle.
- Botones deshabilitados cuando aplica.
