document.addEventListener('DOMContentLoaded', () => {
  // Fetch header then set up filter and search functionality
  fetch('/test-env/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      setupFilterAndSearch();
    })
    .catch(error => console.error('Error fetching header:', error));

  // Fetch footer
  fetch('/test-env/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.error('Error fetching footer:', error));
});

function setupFilterAndSearch() {
  // Filtering functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const articles = document.querySelectorAll('.article-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Show or hide articles based on selected category
      articles.forEach(article => {
        article.style.display =
          category === 'all' || article.getAttribute('data-category') === category
            ? 'block'
            : 'none';
      });

      // Update active filter button appearance
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // --- Updated Search Functionality ---
  // Uses the correct button ID ("search-btn") from header.html
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        // Loop over each article and check the title and summary
        articles.forEach(article => {
          const titleEl = article.querySelector('h3');
          const summaryEl = article.querySelector('p');
          const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
          const summaryText = summaryEl ? summaryEl.textContent.toLowerCase() : '';
          // Display the article if either the title or summary contains the search query
          article.style.display = (titleText.includes(query) || summaryText.includes(query)) ? 'block' : 'none';
        });
      } else {
        alert('Please enter a search term.');
      }
    });
  }
}
