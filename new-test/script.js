//script.js

const NEWS_API_KEY = 'YOUR_API_KEY_HERE';
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';

async function fetchNews() {
  const container = document.querySelector('.news-grid');
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${NEWS_API_KEY}`
    );
    const data = await res.json();
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
    container.innerHTML = `<p class="error-message">Couldn’t load news.</p>`;
  }
}

async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await res.json();
    document.querySelector('.weather-temp').textContent =
      `${Math.round(data.main.temp)}°C`;
  } catch (err) {
    document
      .querySelector('.header-weather')
      .insertAdjacentHTML(
        'beforeend',
        `<span class="error-message">Couldn’t load weather.</span>`
      );
  }
}

async function updateWeather() {
  const locations = ['London', 'Manchester', 'Edinburgh'];
  for (let loc of locations) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      const card = document.querySelector(`[data-location="${loc}"]`);
      if (card) {
        card.querySelector('.temp').textContent =
          `${Math.round(data.main.temp)}°C`;
        card.querySelector('.condition').textContent =
          data.weather[0].main;
      }
    } catch {}
  }
}

function addThemeSwitcher() {
  const btn = document.createElement('button');
  btn.textContent = 'Toggle High Contrast';
  btn.classList.add('theme-switcher');
  document.body.prepend(btn);
  btn.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });
}

function simulateLiveScores() {
  const scores = document.querySelectorAll('.score');
  setInterval(() => {
    scores.forEach(s => {
      let [a, b] = s.textContent.split('–').map(n => parseInt(n.trim()));
      if (Math.random() > 0.7) {
        if (Math.random() > 0.5) a++; else b++;
        s.textContent = `${a} – ${b}`;
      }
    });
  }, 5000);
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('.lazy-load');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        o.unobserve(img);
      }
    });
  }, { rootMargin: '0px 0px 100px 0px' });
  lazyImages.forEach(img => obs.observe(img));
}

function addScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('animated');
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

function addVideoControls() {
  document.querySelectorAll('video').forEach(video => {
    const controls = document.createElement('div');
    controls.className = 'custom-video-controls';
    controls.innerHTML = `
      <button class="play-pause">⏯</button>
      <input type="range" class="volume" min="0" max="1" step="0.1" value="1">
    `;
    video.parentNode.insertBefore(controls, video.nextSibling);

    const [btn, vol] = controls.children;
    btn.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
    vol.addEventListener('input', () => {
      video.volume = vol.value;
    });
  });
}

function init() {
  // Date
  const now = new Date();
  document.querySelector('.header-date').textContent =
    now.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  // Image error fallback
  document.querySelectorAll('img').forEach(img => {
    img.onerror = () => { img.style.display = 'none'; };
  });

  // Mobile‐menu toggle
  const btn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', (!expanded).toString());
    nav.style.display = expanded ? 'none' : 'flex';
  });

  // Kick off features
  fetchNews();
  fetchWeather();
  updateWeather();
  addThemeSwitcher();
  simulateLiveScores();
  lazyLoadImages();
  addScrollAnimations();
  addVideoControls();
}

document.addEventListener('DOMContentLoaded', init);
