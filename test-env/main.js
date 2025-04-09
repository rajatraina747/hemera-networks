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

  // Search functionality
  const searchInput = document.getElementById('search-input');
  // Updated to use the correct ID ("search") that exists in your header.html:
  const searchBtn = document.getElementById('search');  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        console.log('Searching for:', query);
        // Insert custom search behavior here:
        // Example: filter articles or redirect to a search results page.
      } else {
        alert('Please enter a search term.');
      }
    });
  }
}