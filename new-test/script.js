// script.js

const NEWS_API_KEY    = 'e8c89187882d4906b54062dddbca65bc';
const WEATHER_API_KEY = '672c22632e1f7263d3877166fe0eda01';

async function fetchNews() {
  const container = document.querySelector('.news-grid');
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=gb&apiKey=${NEWS_API_KEY}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.message);
    container.innerHTML = data.articles.slice(0, 3).map(a => `
      <article class="news-article">
        <img src="${a.urlToImage || 'placeholder.jpg'}"
             alt="${a.title}"
             loading="lazy">
        <h3>${a.title}</h3>
        <p>${a.description || ''}</p>
        <span class="category-uk">UK News</span>
      </article>
    `).join('');
  } catch (err) {
    console.error('News error:', err);
    container.innerHTML = `
      <p class="error-message">
        Couldn’t load news: ${err.message}
      </p>
    `;
  }
}

async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${WEATHER_API_KEY}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    document.getElementById('header-weather-temp')
            .textContent = `${Math.round(data.main.temp)}°C`;
  } catch (err) {
    console.error('Header weather error:', err);
  }
}

async function updateWeather() {
  const locations = ['London','Manchester','Edinburgh'];
  for (let loc of locations) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${WEATHER_API_KEY}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const card = document.querySelector(`.weather-card[data-location="${loc}"]`);
      card.querySelector('.temp').textContent =
        `${Math.round(data.main.temp)}°C`;
      card.querySelector('.condition').textContent =
        data.weather[0].main;
    } catch (err) {
      console.error(`Weather error for ${loc}:`, err);
    }
  }
}

function simulateLiveScores() {
  const scores = document.querySelectorAll('.score');
  setInterval(() => {
    scores.forEach(s => {
      let [a,b] = s.textContent.split('–').map(n=>+n.trim());
      if (Math.random()>0.7) (Math.random()>0.5? a: b)++;
      s.textContent = `${a} – ${b}`;
    });
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set header date
  const now = new Date();
  document.getElementById('header-date').textContent =
    now.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  // 2. Mobile menu toggle
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

  // 3. Image error fallback
  document.querySelectorAll('img').forEach(img => {
    img.onerror = () => { img.style.display = 'none'; };
  });

  // 4. Kick off data fetches & extras
  fetchNews();
  fetchWeather();
  updateWeather();
  simulateLiveScores();
});
