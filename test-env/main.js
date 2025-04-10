// ------------------------------
// MAIN.JS
// ------------------------------

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Fetch the header and set up search & filter functionality.
  fetch('/test-env/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      setupFilterAndSearch();
    })
    .catch(error => console.error('Error fetching header:', error));

  // Fetch the footer
  fetch('/test-env/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.error('Error fetching footer:', error));

  // Load articles data from JSON file
  fetch('/test-env/articles.json')
    .then(response => response.json())
    .then(data => {
      window.articlesData = data;
      // If the homepage's latest articles section exists, load homepage articles.
      if (document.querySelector('.latest-articles-overall')) {
        loadHomepageArticles();
      }
      // If the current page is a sport landing page (e.g., body has class "sport-page"),
      // then load sport-specific articles.
      if (document.body.classList.contains('sport-page')) {
        loadSportLanding();
      }
    })
    .catch(error => console.error('Error loading articles:', error));
});


// ------------------------------
// FILTER & SEARCH SETUP
// ------------------------------
function setupFilterAndSearch() {
  // Setup filter functionality (only if filter buttons exist on the page)
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    const articles = document.querySelectorAll('.article-item');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        // Show/hide articles based on the filter button's category
        articles.forEach(article => {
          article.style.display =
            category === 'all' || article.getAttribute('data-category') === category
              ? 'block'
              : 'none';
        });
        // Update button active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // Setup search functionality (using the search input in the header)
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        // Loop over articles (those in .article-item) and show/hide based on title or summary match.
        const articles = document.querySelectorAll('.article-item');
        articles.forEach(article => {
          const titleEl = article.querySelector('h3');
          const summaryEl = article.querySelector('p');
          const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
          const summaryText = summaryEl ? summaryEl.textContent.toLowerCase() : '';
          article.style.display = (titleText.includes(query) || summaryText.includes(query)) ? 'block' : 'none';
        });
      } else {
        alert('Please enter a search term.');
      }
    });
  }
}


// ------------------------------
// HOMEPAGE ARTICLES LOADING
// ------------------------------
function loadHomepageArticles() {
  if (!window.articlesData) return;
  // Sort articles in descending order by date (newest first)
  const sortedArticles = [...window.articlesData].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Get the top 5 overall articles
  const topOverall = sortedArticles.slice(0, 5);
  insertLatestOverall(topOverall);

  // Load articles by category (example: sport, news, automotive)
  const sportArticles = sortedArticles.filter(article => article.category === 'sport').slice(0, 5);
  const newsArticles = sortedArticles.filter(article => article.category === 'news').slice(0, 5);
  const autoArticles = sortedArticles.filter(article => article.category === 'automotive').slice(0, 5);

  insertCategoryArticles(sportArticles, '.sport-articles-container');
  insertCategoryArticles(newsArticles, '.news-articles-container');
  insertCategoryArticles(autoArticles, '.auto-articles-container');
}

function insertLatestOverall(articles) {
  const container = document.querySelector('.latest-articles-container');
  if (!container) return;
  container.innerHTML = '';
  articles.forEach(article => {
    const markup = `
      <article class="article-card">
        <img src="${article.image}" alt="${article.title}" />
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a href="${article.url}">Read More</a>
      </article>
    `;
    container.insertAdjacentHTML('beforeend', markup);
  });
}

function insertCategoryArticles(articles, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';
  articles.forEach(article => {
    const markup = `
      <article class="article-card">
        <img src="${article.image}" alt="${article.title}" />
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a href="${article.url}">Read More</a>
      </article>
    `;
    container.insertAdjacentHTML('beforeend', markup);
  });
}


// ------------------------------
// SPORT LANDING PAGE LOADING
// ------------------------------
function loadSportLanding() {
  if (!window.articlesData) return;
  // Filter sport articles and sort them by date descending.
  const sortedSport = window.articlesData
    .filter(article => article.category === 'sport')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // For the sport landing page, designate:
  // 1. A feature article (of type "feature")
  const sportFeature = sortedSport.find(article => article.type === 'feature');
  // 2. Up to 5 primary sport articles
  const primaries = sortedSport.filter(article => article.type === 'primary').slice(0, 5);
  // 3. Up to 5 secondary sport articles
  const secondaries = sortedSport.filter(article => article.type === 'secondary').slice(0, 5);

  insertSportFeature(sportFeature);
  insertSportPrimaries(primaries);
  insertSportSecondaries(secondaries);
}

function insertSportFeature(article) {
  const container = document.querySelector('.sport-landing-feature');
  if (!container || !article) return;
  container.innerHTML = `
    <article class="sport-feature">
      <img src="${article.image}" alt="${article.title}" />
      <h2>${article.title}</h2>
      <p>${article.summary}</p>
      <a href="${article.url}">Read More</a>
    </article>
  `;
}

function insertSportPrimaries(articles) {
  const container = document.querySelector('.sport-landing-primaries');
  if (!container) return;
  container.innerHTML = '';
  articles.forEach(article => {
    const markup = `
      <article class="sport-primary">
        <img src="${article.image}" alt="${article.title}" />
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a href="${article.url}">Read More</a>
      </article>
    `;
    container.insertAdjacentHTML('beforeend', markup);
  });
}

function insertSportSecondaries(articles) {
  const container = document.querySelector('.sport-landing-secondaries');
  if (!container) return;
  container.innerHTML = '';
  articles.forEach(article => {
    const markup = `
      <article class="sport-secondary">
        <img src="${article.image}" alt="${article.title}" />
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a href="${article.url}">Read More</a>
      </article>
    `;
    container.insertAdjacentHTML('beforeend', markup);
  });
}
