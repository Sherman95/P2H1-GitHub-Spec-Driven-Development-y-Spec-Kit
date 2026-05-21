# Pokedex Atlas - P2H1

App en React + Vite creada con Spec Driven Development y Spec Kit. Consume PokeAPI para listar pokemon, ver detalles y armar un equipo persistido en localStorage.

## Demo
- GitHub Pages: https://sherman95.github.io/P2H1-GitHub-Spec-Driven-Development-y-Spec-Kit/

## Funcionalidades
- Lista de pokemon (60) con busqueda en tiempo real.
- Detalle con imagen oficial, tipos, altura, peso, habilidades y stats.
- Equipo local con favoritos y persistencia en localStorage.
- Estados de carga y error.

## Stack
- React + Vite
- Fetch API
- gh-pages para deploy

## Especificaciones
Las especificaciones y el plan de trabajo estan en el folder specs:
- specs/01-product-spec.md
- specs/02-ux-spec.md
- specs/03-technical-spec.md
- specs/04-task-plan.md

## Scripts
- npm run dev: desarrollo local
- npm run build: build de produccion
- npm run deploy: publica a GitHub Pages

## Desarrollo local
1. npm install
2. npm run dev

## Deploy a GitHub Pages
1. npm run deploy
2. En GitHub: Settings -> Pages -> Branch: gh-pages / root

## API
- Lista: https://pokeapi.co/api/v2/pokemon?limit=60
- Detalle: https://pokeapi.co/api/v2/pokemon/{id}
- Sprites: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
