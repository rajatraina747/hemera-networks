// script.js

// Your WeatherAPI.com key (for header, cards, and map)
const WEATHERAPI_KEY = 'YOUR_WEATHERAPI_KEY';
window.WEATHERAPI_KEY = WEATHERAPI_KEY;

// Utility to load external HTML into a container
async function loadHTML(containerId, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (e) {
    console.error(`Error loading ${url}`, e);
  }
}

// Load header and footer
window.addEventListener('DOMContentLoaded', async () => {
  await loadHTML('header-container', '/header.html');
  await loadHTML('footer-container', '/footer.html');
  updateDate();
  fetchHeaderWeather();
  fetchCardWeather();
  initMap();
});

// Update the date element
function updateDate() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// Fetch current weather for header (e.g., Swansea)
async function fetchHeaderWeather() {
  try {
    const city = 'Swansea';
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}`);
    const data = await res.json();
    const tempSpan = document.getElementById('weather');
    tempSpan.textContent = `${Math.round(data.current.temp_c)}°C`;
    tempSpan.setAttribute('aria-label', `${data.location.name}: ${data.current.temp_c}°C, ${data.current.condition.text}`);
  } catch (err) {
    console.error('Header weather error', err);
  }
}

// Fetch weather for each card based on data-lat and data-lon
async function fetchCardWeather() {
  const cards = document.querySelectorAll('.weather-card');
  cards.forEach(async (card) => {
    const lat = card.dataset.lat;
    const lon = card.dataset.lon;
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}`);
      const data = await res.json();
      card.querySelector('.temp').textContent = `${Math.round(data.current.temp_c)}°C`;
      const img = card.querySelector('img');
      img.src = `https:${data.current.condition.icon}`;
      img.alt = data.current.condition.text;
    } catch (err) {
      console.error('Card weather error', err);
    }
  });
}

// Initialize map with WeatherAPI data
function initMap() {
  if (typeof L === 'undefined') return;
  const mapDiv = document.getElementById('weather-map');
  if (!mapDiv) return;

  const map = L.map('weather-map', { center: [20, 0], zoom: 2 });
  const markers = L.markerClusterGroup().addTo(map);
  map.invalidateSize();

  const coords = [
    { name: 'London', lat: 51.51, lon: -0.13 },
    { name: 'New York', lat: 40.71, lon: -74.01 },
    { name: 'Sydney', lat: -33.87, lon: 151.21 },
    { name: 'Tokyo', lat: 35.68, lon: 139.69 }
  ];

  // Bulk fetch for initial markers
  const query = coords.map(c => `${c.lat},${c.lon}`).join(',');
  fetch(`https://api.weatherapi.com/v1/bulk.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      data.locations.forEach((loc) => {
        const { lat, lon } = loc.location;
        const { temp_c, condition } = loc.current;
        const iconUrl = `https:${condition.icon}`;
        const icon = L.icon({ iconUrl, iconSize: [32, 32], iconAnchor: [16, 16] });
        L.marker([lat, lon], { icon })
          .bindPopup(`<strong>${loc.location.name}</strong><br>${Math.round(temp_c)}°C, ${condition.text}`)
          .addTo(markers);
      });
    })
    .catch(err => console.error('Bulk-weather error', err));

  // Click-to-lookup
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lng}`)
      .then(res => res.json())
      .then(data => {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`<strong>${data.location.name}</strong><br>${Math.round(data.current.temp_c)}°C, ${data.current.condition.text}`)
          .openOn(map);
      })
      .catch(err => console.error('Map lookup error', err));
  });
}
