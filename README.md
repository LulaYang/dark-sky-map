# Dark Sky Map

An interactive web map exploring certified International Dark Sky Places across the United States.

## What is this?

Light pollution is a growing environmental issue that prevents millions of people from seeing the night sky. DarkSky International certifies communities, parks, reserves, and sanctuaries that actively protect dark skies through responsible lighting policies and public education. This map visualizes those certified locations across the US, allowing users to explore and learn about each place.

## Features

- Interactive Mapbox GL JS map with a night-themed basemap
- GeoJSON data displayed using Mapbox sources and layers
- Data-driven color styling by certification category:
  - **Yellow** — Dark Sky Community
  - **Blue** — Dark Sky Park
  - **Rose** — Dark Sky Reserve
  - **Orange** — Dark Sky Sanctuary
- Click any marker to view location details and a link to the official DarkSky page
- Legend for easy category identification

## Data

Location data was compiled manually from [DarkSky International](https://darksky.org/places/) and stored as a GeoJSON file (`locations.geojson`). Each feature includes:
- Name and state
- Certification category
- Year designated
- Description
- Link to the official DarkSky International page

## Technology

- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) — interactive map rendering
- HTML, CSS, JavaScript — page structure, styling, and interactivity
- GeoJSON — geographic data format
- GitHub Pages — hosting and deployment

## Live Site

[https://LulaYang.github.io/dark-sky-map](https://LulaYang.github.io/dark-sky-map)

## Repository

[https://github.com/LulaYang/dark-sky-map](https://github.com/LulaYang/dark-sky-map)
