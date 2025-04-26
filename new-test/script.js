const NEWS_API_KEY    = 'e8c89187882d4906b54062dddbca65bc';
const WEATHER_API_KEY = '672c22632e1f7263d3877166fe0eda01';

// Load header snippet
async function loadHeader() {
  try {
    const res  = await fetch('header.html');
    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;
  } catch (e) {
    console.error('Header load failed', e);
  }
}

// Load footer snippet
async function loadFooter() {
  try {
    const res  = await fetch('footer.html');
    const html = await res.text();
    document.getElementById('footer-container').innerHTML = html;
  } catch (e) {
    console.error('Footer load failed', e);
  }
}

// Fetch top headlines (GB-wide)
async function fetchNews() {
  const container = document.querySelector('.news-grid');
  try {
    const res  = await fetch(
      `https://newsapi.org/v2/top-headlines?country=gb&apiKey=${NEWS_API_KEY}`
    );
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.message || 'Bad status');
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
    container.innerHTML = `<p class="error-message">Couldn’t load news.</p>`;
  }
}

// Header weather (London)
async function fetchWeather() {
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await res.json();
    document.querySelector('.header-weather .weather-temp')
            .textContent = `${Math.round(data.main.temp)}°C`;
  } catch (e) {
    console.error('Header weather error:', e);
  }
}

// Populate cards for multiple cities
async function updateWeather() {
  const locations = ['London','Manchester','Edinburgh'];
  for (let loc of locations) {
    try {
      const res  = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      const card = document.querySelector(`[data-location="${loc}"]`);
      if (!card) continue;
      card.querySelector('.temp').textContent =
        `${Math.round(data.main.temp)}°C`;
      card.querySelector('.condition').textContent =
        data.weather[0].main;
    } catch (__) { /* silent fail per city */ }
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

function lazyLoadImages() {
  const imgs = document.querySelectorAll('.lazy-load');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      o.unobserve(img);
    });
  }, { rootMargin: '0px 0px 100px 0px' });
  imgs.forEach(i => obs.observe(i));
}

function addScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('animated');
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

async function init() {
  // 1) Load header & footer
  await loadHeader();
  await loadFooter();

  // 2) Hamburger toggle
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
      btn.setAttribute('aria-expanded','false');
    }
  });

  // 3) Date in header
  const now = new Date();
  document.querySelector('.header-date').textContent =
    now.toLocaleDateString('en-GB', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

  // 4) Image-error fallback
  document.querySelectorAll('img').forEach(img => {
    img.onerror = () => img.style.display = 'none';
  });

  // 5) Data & extras
  fetchNews();
  fetchWeather();
  updateWeather();
  simulateLiveScores();
  lazyLoadImages();
  addScrollAnimations();
}

document.addEventListener('DOMContentLoaded', init);
