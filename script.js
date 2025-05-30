// script.js

// --- Configuration ---
const WEATHER_API_KEY = 'ceb1286f17de4a45806211356250105';
window.WEATHER_API_KEY = WEATHER_API_KEY;

// --- Utility to load header/footer ---
async function loadHTML(containerId, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    document.getElementById(containerId).innerHTML = await res.text();
  } catch (e) {
    console.error(`Error loading ${url}`, e);
  }
}

// --- Update Header Date ---
function updateDate() {
  const now = new Date();
  document.getElementById('header-date').textContent = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric'
  });
}

// --- Fetch Header Weather ---
async function fetchHeaderWeather() {
  try {
    const res  = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Swansea`
    );
    const data = await res.json();
    const w    = data.current;

    const tempEl = document.getElementById('header-weather-temp');
    tempEl.textContent = `${Math.round(w.temp_c)}°C`;
    tempEl.setAttribute(
      'aria-label',
      `${data.location.name}: ${w.temp_c}°C, ${w.condition.text}`
    );

    const iconEl = document.getElementById('header-weather-icon');
    iconEl.src = `https:${w.condition.icon}`;
    iconEl.alt = w.condition.text;

    document.getElementById('header-weather-location').textContent = data.location.name;
  } catch (err) {
    console.error('Header weather error', err);
  }
}

// --- Fetch Weather for Cards by City Name ---
async function fetchCardWeather() {
  document.querySelectorAll('.weather-card').forEach(async (card) => {
    const city = card.dataset.location;
    try {
      const res  = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      const w    = data.current;

      const tempEl = card.querySelector('.temp');
      if (tempEl) tempEl.textContent = `${Math.round(w.temp_c)}°C`;

      const iconEl = card.querySelector('img.weather-icon');
      if (iconEl) {
        iconEl.src = `https:${w.condition.icon}`;
        iconEl.alt = w.condition.text;
      }

      const condEl = card.querySelector('.condition');
      if (condEl) condEl.textContent = w.condition.text;
    } catch (err) {
      console.error(`Weather card error for ${city}`, err);
    }
  });
}

// --- Initialize & Populate Map (click-only) ---
function initMap() {
  if (typeof L === 'undefined' || !document.getElementById('weather-map')) return;

  // 1) Create the map centered on the UK
  const map = L.map('weather-map').setView([54.5, -3], 5);

  // 2) Base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 3) MarkerCluster group
  const markers = L.markerClusterGroup();
  map.addLayer(markers);

  // 4) Helper: fetch & popup weather for a marker
  async function loadWeatherAt(marker) {
    const { lat, lng } = marker.getLatLng();

    // Bind a loading popup
    marker.bindPopup('Loading weather…').openPopup();

    try {
      const res  = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lng}`
      );
      const data = await res.json();
      const w    = data.current;
      const loc  = data.location.name || `(${lat.toFixed(2)},${lng.toFixed(2)})`;

      // Build the popup content
      const html = `
        <strong>${loc}</strong><br/>
        <img src="https:${w.condition.icon}" alt="${w.condition.text}" /><br/>
        ${Math.round(w.temp_c)}°C — ${w.condition.text}
      `;

      // Re-bind popup with real data and re-open
      marker.bindPopup(html).openPopup();
    } catch (e) {
      marker.bindPopup('Error loading weather').openPopup();
      console.error(e);
    }
  }

  // 5) On map click: drop a marker & fetch its weather
  map.on('click', (e) => {
    const m = L.marker(e.latlng);
    markers.addLayer(m);
    loadWeatherAt(m);
  });
}

// --- Bootstrapping on DOM ready ---
document.addEventListener('DOMContentLoaded', async () => {
  await loadHTML('header-container', '/header.html');
  await loadHTML('footer-container', '/footer.html');

  updateDate();
  fetchHeaderWeather();
  fetchCardWeather();
  initMap();
});
