// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibHVsYXlhbmciLCJhIjoiY21oZHAzMTYwMDVkZjJ2cHZyaHh6N3E5ayJ9.1DHnr-Iov8QBokd0I6pYTA';

// Initialize the map centered on the US
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  center: [-98.5795, 39.8283],
  zoom: 3.5
});

// CSS class mapping for popup category tags
const categoryClasses = {
  'Dark Sky Community': 'tag-community',
  'Dark Sky Park': 'tag-park',
  'Dark Sky Reserve': 'tag-reserve',
  'Dark Sky Sanctuary': 'tag-sanctuary'
};

// Load GeoJSON data and add layers to the map
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
      // Color each circle based on its category property
      'circle-color': [
        'match',
        ['get', 'category'],
        'Dark Sky Community', '#F9F871',
        'Dark Sky Park', '#00A6E1',
        'Dark Sky Reserve', '#A25D6B',
        'Dark Sky Sanctuary', '#F79334',
        '#ffffff'
      ],
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 1
    }
  });

  // Show popup when user clicks a circle
  map.on('click', 'dark-sky-circles', (e) => {
    const props = e.features[0].properties;
    const coords = e.features[0].geometry.coordinates;
    const tagClass = categoryClasses[props.category] || 'tag-community';

    // Build popup HTML content
    const html = `
      <div class="popup-body">
        <h3>${props.name}, ${props.state}</h3>
        <span class="category-tag ${tagClass}">${props.category}</span>
        <p>${props.description}</p>
        <p><strong>Designated:</strong> ${props.designated}</p>
        <a href="https://darksky.org/places/" target="_blank" class="learn-more">Learn more about dark sky certification →</a>
      </div>
    `;

    // Display popup at the clicked location
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

// Add navigation controls to top right
map.addControl(new mapboxgl.NavigationControl(), 'top-right');
