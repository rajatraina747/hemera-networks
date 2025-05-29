// script.js

// --- Configuration ---
const WEATHER_API_KEY = 'ceb1286f17de4a45806211356250105';
window.WEATHER_API_KEY = WEATHER_API_KEY;

// --- Header Date ---
function updateDate() {
  const now = new Date();
  document.getElementById('header-date').textContent = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// --- Header Weather ---
async function fetchHeaderWeather() {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Swansea`);
    const data = await res.json();

    // Temperature
    const tempEl = document.getElementById('header-weather-temp');
    tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;
    tempEl.setAttribute(
      'aria-label',
      `${data.location.name}: ${data.current.temp_c}°C, ${data.current.condition.text}`
    );

    // Icon
    const iconEl = document.getElementById('header-weather-icon');
    iconEl.src = `https:${data.current.condition.icon}`;
    iconEl.alt = data.current.condition.text;

    // Location name
    document.getElementById('header-weather-location').textContent = data.location.name;
  } catch (err) {
    console.error('Header weather error', err);
  }
}

// --- Weather Cards ---
async function fetchCardWeather() {
  document.querySelectorAll('.weather-card').forEach(async card => {
    const city = card.dataset.location;
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`
      );
      const data = await res.json();

      // Update temp
      const tempEl = card.querySelector('.temp');
      if (tempEl) tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;

      // Update icon
      const iconEl = card.querySelector('img');
      if (iconEl) {
        iconEl.src = `https:${data.current.condition.icon}`;
        iconEl.alt = data.current.condition.text;
      }

      // Update condition text
      const condEl = card.querySelector('.condition');
      if (condEl) condEl.textContent = data.current.condition.text;
    } catch (err) {
      console.error(`Weather card error for ${city}`, err);
    }
  });
}

// --- Global Map (weather.html) ---
function initMap() {
  const map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  // Optionally add markers here...
}

// --- Bootstrapping on DOM ready ---
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  fetchHeaderWeather();
  fetchCardWeather();

  // Only initialize map if Leaflet (`L`) is loaded
  if (typeof L !== 'undefined' && document.getElementById('map')) {
    initMap();
  }
});
