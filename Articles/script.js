// script.js

const WEATHER_API_KEY = '672c22632e1f7263d3877166fe0eda01';

async function loadHTML(id, url) {
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  document.getElementById(id).innerHTML = await res.text();
}

async function fetchHeaderWeather() {
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Swansea&units=metric&appid=${WEATHER_API_KEY}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    document.getElementById('header-weather-temp')
            .textContent = `${Math.round(data.main.temp)}°C`;
  } catch (e) {
    console.error(e);
  }
}

async function fetchCardWeather() {
  const cities = ['London','Cardiff','Edinburgh'];
  for (let city of cities) {
    try {
      const res  = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const card = document.querySelector(`.weather-card[data-location="${city}"]`);
      card.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
      card.querySelector('.condition').textContent = data.weather[0].main;
    } catch (e) {
      console.error(`Weather (${city})`, e);
    }
  }
}

function setupHamburger() {
  const btn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    const exp = btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', String(!exp));
    nav.classList.toggle('open');
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadHTML('header-container','/header.html');
    await loadHTML('footer-container','/footer.html');
  } catch (e) {
    console.error(e);
  }

  // date
  document.getElementById('header-date').textContent =
    new Date().toLocaleDateString('en-GB', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

  setupHamburger();
  fetchHeaderWeather();
  fetchCardWeather();
});
