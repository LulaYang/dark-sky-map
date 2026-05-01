// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibHVsYXlhbmciLCJhIjoiY21oZHAzMTYwMDVkZjJ2cHZyaHh6N3E5ayJ9.1DHnr-Iov8QBokd0I6pYTA';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  center: [-98.5795, 39.8283],
  zoom: 3.5
});

// Color mapping for each category
const categoryColors = {
  'Dark Sky Community': '#5c6bc0',
  'Dark Sky Park': '#43a047',
  'Dark Sky Reserve': '#fb8c00',
  'Dark Sky Sanctuary': '#e53935'
};

// CSS class mapping for popup tags
const categoryClasses = {
  'Dark Sky Community': 'tag-community',
  'Dark Sky Park': 'tag-park',
  'Dark Sky Reserve': 'tag-reserve',
  'Dark Sky Sanctuary': 'tag-sanctuary'
};

// Load GeoJSON data and add to map
map.on('load', () => {

  // Add GeoJSON file as a data source
  map.addSource('dark-sky-places', {
    type: 'geojson',
    data: 'locations.geojson'
  });

  // Add a circle layer with data-driven color styling
  map.addLayer({
    id: 'dark-sky-circles',
    type: 'circle',
    source: 'dark-sky-places',
    paint: {
      // Color circles based on category
      'circle-color': [
        'match',
        ['get', 'category'],
        'Dark Sky Community', '#5c6bc0',
        'Dark Sky Park', '#43a047',
        'Dark Sky Reserve', '#fb8c00',
        'Dark Sky Sanctuary', '#e53935',
        '#ffffff'
      ],
      'circle-radius': 9,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      // Glow effect
      'circle-opacity': 0.9
    }
  });

  // Show popup when user clicks a circle
  map.on('click', 'dark-sky-circles', (e) => {
    const props = e.features[0].properties;
    const coords = e.features[0].geometry.coordinates;
    const tagClass = categoryClasses[props.category] || 'tag-community';

    // Build popup HTML
    const html = `
      <div class="popup-body">
        <h3>${props.name}, ${props.state}</h3>
        <span class="category-tag ${tagClass}">${props.category}</span>
        <p>${props.description}</p>
        <p><strong>Designated:</strong> ${props.designated}</p>
      </div>
    `;

    // Display popup at clicked location
    new mapboxgl.Popup({ offset: 10, maxWidth: '240px' })
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

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl(), 'top-right');
