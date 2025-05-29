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
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// --- Fetch Header Weather ---
async function fetchHeaderWeather() {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Swansea`
    );
    const data = await res.json();

    const tempEl = document.getElementById('header-weather-temp');
    tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;
    tempEl.setAttribute(
      'aria-label',
      `${data.location.name}: ${data.current.temp_c}°C, ${data.current.condition.text}`
    );

    const iconEl = document.getElementById('header-weather-icon');
    iconEl.src = `https:${data.current.condition.icon}`;
    iconEl.alt = data.current.condition.text;

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
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`
      );
      const data = await res.json();

      const tempEl = card.querySelector('.temp');
      if (tempEl) tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;

      const iconEl = card.querySelector('img.weather-icon');
      if (iconEl) {
        iconEl.src = `https:${data.current.condition.icon}`;
        iconEl.alt = data.current.condition.text;
      }

      const condEl = card.querySelector('.condition');
      if (condEl) condEl.textContent = data.current.condition.text;
    } catch (err) {
      console.error(`Weather card error for ${city}`, err);
    }
  });
}

// --- Initialize Global Map (weather.html) ---
function initMap() {
  if (typeof L === 'undefined' || !document.getElementById('weather-map')) return;

  const map = L.map('weather-map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

// --- Bootstrapping ---
document.addEventListener('DOMContentLoaded', async () => {
  // inject header & footer
  await loadHTML('header-container', '/header.html');
  await loadHTML('footer-container', '/footer.html');

  updateDate();
  fetchHeaderWeather();
  fetchCardWeather();
  initMap();
});
