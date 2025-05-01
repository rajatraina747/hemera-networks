const NEWS_API_KEY    = 'e8c89187882d4906b54062dddbca65bc';
const WEATHER_API_KEY = '672c22632e1f7263d3877166fe0eda01';
window.WEATHER_API_KEY = '672c22632e1f7263d3877166fe0eda01';

async function loadHTML(id, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  document.getElementById(id).innerHTML = await res.text();
}

async function fetchHeaderWeather() {
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Swansea&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await res.json();
    document.getElementById('header-weather-temp')
            .textContent = `${Math.round(data.main.temp)}°C`;
  } catch (e) {
    console.error('Header weather error', e);
  }
}

async function fetchCardWeather() {
  const cities = ['London','Cardiff','Edinburgh'];
  for (let city of cities) {
    try {
      const res  = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      const card = document.querySelector(`.weather-card[data-location="${city}"]`);
      if (card) {
        card.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
        card.querySelector('.condition').textContent = data.weather[0].main;
      }
    } catch (__) {}
  }
}

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

  // set today's date
  document.getElementById('header-date').textContent =
    new Date().toLocaleDateString('en-GB', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

  setupHamburger();
  fetchHeaderWeather();
  fetchCardWeather();
});
