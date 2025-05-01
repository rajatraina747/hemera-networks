const NEWS_API_KEY    = 'e8c89187882d4906b54062dddbca65bc';
const WEATHER_API_KEY = 'ceb1286f17de4a45806211356250105'; // 👈 replace with your WeatherAPI.com key
window.WEATHER_API_KEY = WEATHER_API_KEY;

// Generic HTML loader (header & footer)
async function loadHTML(id, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  document.getElementById(id).innerHTML = await res.text();
}

// Fetch & render the top‐banner weather
async function fetchHeaderWeather() {
  try {
    const res  = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}` +
      `&q=Swansea`
    );
    if (!res.ok) throw new Error('WeatherAPI error');
    const data = await res.json();
    document.getElementById('header-weather-temp')
            .textContent = `${Math.round(data.current.temp_c)}°C`;
    const iconEl = document.getElementById('header-weather-icon');
    iconEl.src = `https:${data.current.condition.icon}`;
    iconEl.alt = data.current.condition.text;
    document.getElementById('header-weather-location')
            .textContent = data.location.name;
  } catch (e) {
    console.error('Header weather error', e);
  }
}

// Fetch & render each card’s weather
async function fetchCardWeather() {
  const cards = document.querySelectorAll('.weather-card');
  for (let card of cards) {
    const city = card.dataset.location;
    try {
      const res  = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}` +
        `&q=${encodeURIComponent(city)}`
      );
      if (!res.ok) throw new Error('WeatherAPI error');
      const data = await res.json();
      card.querySelector('.temp').textContent =
        `${Math.round(data.current.temp_c)}°C`;
      card.querySelector('.condition').textContent =
        data.current.condition.text;
      const iconEl = card.querySelector('.weather-icon');
      iconEl.src = `https:${data.current.condition.icon}`;
      iconEl.alt = data.current.condition.text;
    } catch (e) {
      console.warn(`Error loading weather for ${city}`, e);
    }
  }
}

// Hamburger menu behavior (unchanged)
function setupHamburger() {
  const btn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadHTML('header-container','/header.html');
    await loadHTML('footer-container','/footer.html');
  } catch (e) {
    console.error('Partial load failed', e);
  }

  // Populate date
  document.getElementById('header-date').textContent =
    new Date().toLocaleDateString('en-GB', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

  setupHamburger();
  fetchHeaderWeather();
  fetchCardWeather();
});
