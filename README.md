# 🌌 Dark Sky Explorer

An interactive web map exploring certified **International Dark Sky Places** across North America. Built with Mapbox GL JS for a final project in web mapping.

**[🔗 Live Site](#)** · **[📁 Repository](#)**

---

## About the Project

Dark Sky Explorer lets users discover locations certified by the [International Dark-Sky Association (IDA)](https://darksky.org) — places committed to reducing light pollution and preserving the natural night sky.

The site features 26 certified locations across the US, spanning four designation categories: Communities, Parks, Reserves, and Sanctuaries.

---

## Features

- 🌍 **Globe projection** — immersive 3D globe rendering via Mapbox GL JS
- 🔵 **Color-coded markers** — four categories with distinct colors and glow effects
- 🔍 **Category filters** — filter markers by designation type
- 💬 **Interactive popups** — click any marker for description, year designated, and external link
- 📖 **IDA info panel** — learn about the certification body and each category type
- ✨ **Star canvas background** — animated star particles for atmosphere
- 🔒 **Bounded navigation** — zoom and pan constrained to North America

---

## Data

Location data is stored in `locations.geojson` and sourced from the [IDA's official place listings](https://darksky.org/places/). Each feature includes:

| Field | Description |
|---|---|
| `name` | Location name |
| `state` | US state |
| `category` | IDA designation type |
| `designated` | Year of certification |
| `description` | Brief description |
| `url` | Link to IDA listing |

---

## File Structure

```
dark-sky-explorer/
├── index.html        # Page structure and layout
├── style.css         # All visual styling and CSS variables
├── script.js         # Map logic, filters, popups, star animation
├── locations.geojson # Dark sky place data (26 locations)
└── README.md         # Project documentation
```

---

## Technologies

- [Mapbox GL JS v3.3.0](https://docs.mapbox.com/mapbox-gl-js/) — map rendering and Globe projection
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) — typography
- Vanilla HTML / CSS / JavaScript — no frameworks

---

## Upgrades from Previous Version

This final version addresses instructor feedback from the midterm submission:

- Added **Globe projection** for a more fitting and visually striking view of North America
- Added **zoom limits** (`minZoom: 2.5`, `maxZoom: 8`) to prevent irrelevant zoom levels
- Added **map bounds** locked to North America (`maxBounds`)
- Added **IDA certification info panel** explaining the certifying body and category criteria
- Added **category filter buttons** for enhanced interactivity
- Added **glow layer** behind markers for visual depth
- Upgraded typography with display + monospace font pairing
