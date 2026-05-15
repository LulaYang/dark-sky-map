// =============================================
// Dark Sky Explorer — script.js
// Upgraded for final project:
//   - Globe projection
//   - Zoom + bounds constraints
//   - Category filter buttons
//   - IDA info panel
//   - Star canvas background
// =============================================

// ── Star Canvas Background ──────────────────
// Draws animated star particles on a canvas
// behind the map for atmosphere
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Generate random star positions and sizes
const stars = Array.from({ length: 180 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.2 + 0.2,
  alpha: Math.random() * 0.6 + 0.2,
  speed: Math.random() * 0.004 + 0.001
}));

// Animate the stars with a slow twinkle effect
function animateStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    // Twinkle by oscillating opacity over time
    const twinkle = star.alpha + Math.sin(t * star.speed * 60) * 0.15;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, twinkle))})`;
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}
requestAnimationFrame(animateStars);


// ── Mapbox Setup ────────────────────────────
mapboxgl.accessToken = 'pk.eyJ1IjoibHVsYXlhbmciLCJhIjoiY21oZHAzMTYwMDVkZjJ2cHZyaHh6N3E5ayJ9.1DHnr-Iov8QBokd0I6pYTA';

// Initialize map with Globe projection, centered on North America
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  center: [-98.5795, 39.8283],
  zoom: 3.5,
  projection: 'globe',    // Globe projection (teacher suggestion)
  minZoom: 2.5,           // Prevent zooming out too far
  maxZoom: 8,             // Prevent zooming too close (no detail at site level)
  maxBounds: [            // Lock map to North America region
    [-175, 12],           // Southwest corner
    [-40, 75]             // Northeast corner
  ]
});

// Add navigation controls (zoom in/out, compass)
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Add atmospheric glow effect for the globe
map.on('style.load', () => {
  map.setFog({
    color: 'rgb(8, 12, 24)',
    'high-color': 'rgb(15, 25, 60)',
    'horizon-blend': 0.08,
    'space-color': 'rgb(4, 6, 14)',
    'star-intensity': 0.8
  });
});


// ── Category Color Mapping ──────────────────
// Maps category names to CSS class names for popup tags
const categoryClasses = {
  'Dark Sky Community': 'tag-community',
  'Dark Sky Park':      'tag-park',
  'Dark Sky Reserve':   'tag-reserve',
  'Dark Sky Sanctuary': 'tag-sanctuary'
};

// Maps category names to Mapbox circle colors
const categoryColors = [
  'match',
  ['get', 'category'],
  'Dark Sky Community', '#F9F871',
  'Dark Sky Park',      '#00A6E1',
  'Dark Sky Reserve',   '#A25D6B',
  'Dark Sky Sanctuary', '#F79334',
  '#ffffff'
];


// ── Map Load: Add Data + Layers ─────────────
map.on('load', () => {

  // Add GeoJSON file as a data source
  map.addSource('dark-sky-places', {
    type: 'geojson',
    data: 'locations.geojson'
  });

  // Add circle layer with data-driven color based on category
  map.addLayer({
    id: 'dark-sky-circles',
    type: 'circle',
    source: 'dark-sky-places',
    paint: {
      'circle-color': categoryColors,
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        2, 6,
        6, 11
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.95
    }
  });

  // Add a subtle glow layer behind each circle
  map.addLayer({
    id: 'dark-sky-glow',
    type: 'circle',
    source: 'dark-sky-places',
    paint: {
      'circle-color': categoryColors,
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        2, 14,
        6, 24
      ],
      'circle-opacity': 0.15,
      'circle-blur': 1
    }
  }, 'dark-sky-circles'); // Insert glow layer below circles


  // ── Click Popup ───────────────────────────
  // Show popup when user clicks a circle marker
  map.on('click', 'dark-sky-circles', (e) => {
    const props = e.features[0].properties;
    const coords = e.features[0].geometry.coordinates;
    const tagClass = categoryClasses[props.category] || 'tag-community';

    // Build popup HTML with location details
    const html = `
      <div class="popup-body">
        <h3>${props.name}, ${props.state}</h3>
        <span class="category-tag ${tagClass}">${props.category}</span>
        <p>${props.description}</p>
        <p class="designated">✦ Designated ${props.designated}</p>
        <a href="${props.url}" target="_blank" class="learn-more">Learn more →</a>
      </div>
    `;

    // Display popup at the clicked location
    new mapboxgl.Popup({ offset: 12, maxWidth: '260px' })
      .setLngLat(coords)
      .setHTML(html)
      .addTo(map);
  });

  // Change cursor to pointer when hovering over circles
  map.on('mouseenter', 'dark-sky-circles', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Reset cursor when leaving circles
  map.on('mouseleave', 'dark-sky-circles', () => {
    map.getCanvas().style.cursor = '';
  });
});


// ── Category Filter Buttons ─────────────────
// Allow users to filter markers by category type
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state on buttons
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selected = btn.dataset.category;

    // Build the Mapbox filter expression
    // "all" shows every feature; otherwise filter by category
    const filterExpr = selected === 'all'
      ? null
      : ['==', ['get', 'category'], selected];

    map.setFilter('dark-sky-circles', filterExpr);
    map.setFilter('dark-sky-glow', filterExpr);
  });
});


// ── IDA Info Panel Toggle ───────────────────
// Show or hide the "About Dark Sky Certification" panel
const idaPanel   = document.getElementById('ida-panel');
const openBtn    = document.getElementById('open-panel');
const closeBtn   = document.getElementById('close-panel');

// Open the info panel
openBtn.addEventListener('click', () => {
  idaPanel.classList.remove('hidden');
});

// Close the info panel
closeBtn.addEventListener('click', () => {
  idaPanel.classList.add('hidden');
});

// Also close the panel if user clicks on the map
map.on('click', () => {
  // Only close if panel is open and click wasn't on a marker
  // (marker click is handled separately above)
  setTimeout(() => {
    if (!idaPanel.classList.contains('hidden')) {
      idaPanel.classList.add('hidden');
    }
  }, 50);
});
