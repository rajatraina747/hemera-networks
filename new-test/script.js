// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    document.querySelector('.nav').appendChild(menuToggle);

    menuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
});

// Image error handling
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        this.style.display = 'none';
    };
});

// News API Integration (using NewsAPI)
const NEWS_API_KEY = 'YOUR_API_KEY'; // Get from https://newsapi.org

async function fetchNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        populateNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function populateNews(articles) {
    const container = document.querySelector('.news-grid');
    container.innerHTML = articles.slice(0, 3).map(article => `
        <article class="news-article">
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <span class="category-uk">UK News</span>
        </article>
    `).join('');
}

// Weather API Integration (using OpenWeatherMap)
async function fetchWeather() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=YOUR_API_KEY');
    const data = await response.json();
    document.querySelector('.weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
}

// Theme switcher for accessibility
function addThemeSwitcher() {
    const themeButton = document.createElement('button');
    themeButton.textContent = 'Toggle High Contrast';
    themeButton.classList.add('theme-switcher');
    document.body.prepend(themeButton);
    
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    fetchWeather();
    addThemeSwitcher();
    
    // Add live indicator
    setInterval(() => {
        document.querySelectorAll('.live-indicator').forEach(indicator => {
            indicator.style.visibility = indicator.style.visibility === 'hidden' ? 'visible' : 'hidden';
        });
    }, 1000);
});