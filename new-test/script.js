// script.js
const NEWS_API_KEY    = 'e8c89187882d4906b54062dddbca65bc';
const WEATHER_API_KEY = '672c22632e1f7263d3877166fe0eda01';

async function fetchNews() {
  const container = document.querySelector('.news-grid');
  try {
    const res  = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${NEWS_API_KEY}`
    );
    const data = await res.json();
    container.innerHTML = data.articles.slice(0, 3).map(a => `
      <article class="news-article">
        <img src="${a.urlToImage||'placeholder.jpg'}"
             alt="${a.title}"
             loading="lazy">
        <h3>${a.title}</h3>
        <p>${a.description||''}</p>
        <span class="category-uk">UK News</span>
      </article>
    `).join('');
  } catch {
    container.innerHTML = `<p class="error-message">Couldn’t load news.</p>`;
  }
}

async function fetchWeather() {
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await res.json();
    document.querySelector('.weather-temp').textContent =
      `${Math.round(data.main.temp)}°C`;
  } catch {
    document.querySelector('.header-weather')
      .insertAdjacentHTML('beforeend',
        `<span class="error-message">Couldn’t load weather.</span>`);
  }
}

async function updateWeather() {
  const locations = ['London','Manchester','Edinburgh'];
  for (let loc of locations) {
    try {
      const res  = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      const card = document.querySelector(`[data-location="${loc}"]`);
      if (card) {
        card.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
        card.querySelector('.condition').textContent = data.weather[0].main;
      }
    } catch {}
  }
}

function simulateLiveScores() {
  const scores = document.querySelectorAll('.score');
  setInterval(() => {
    scores.forEach(s => {
      let [a,b] = s.textContent.split('–').map(n=>parseInt(n.trim()));
      if (Math.random()>0.7) {
        Math.random()>0.5? a++: b++;
        s.textContent = `${a} – ${b}`;
      }
    });
  },5000);
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('.lazy-load');
  const obs = new IntersectionObserver((entries,o) => {
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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('animated');
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

async function loadFooter() {
  try {
    const res  = await fetch('footer.html');
    const html = await res.text();
    document.getElementById('footer-container').innerHTML = html;
  } catch (e) {
    console.error('Footer load failed', e);
  }
}

function init() {
  // 1. Date
  const now = new Date();
  document.querySelector('.header-date').textContent =
    now.toLocaleDateString('en-GB', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

  // 2. Image-error fallback
  document.querySelectorAll('img').forEach(img => {
    img.onerror = () => { img.style.display = 'none'; };
  });

  // 3. Mobile menu toggle
  const btn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', (!expanded).toString());
    nav.style.display = expanded ? 'none' : 'flex';
  });

  // 4. Reset nav on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.removeAttribute('style');
      btn.setAttribute('aria-expanded','false');
    }
  });

  // 5. Kick off features
  fetchNews();
  fetchWeather();
  updateWeather();
  simulateLiveScores();
  lazyLoadImages();
  addScrollAnimations();
  loadFooter();
}

document.addEventListener('DOMContentLoaded', init);
