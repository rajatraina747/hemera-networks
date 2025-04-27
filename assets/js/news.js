// news.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput   = document.getElementById('news-search');
    const newsContainer = document.getElementById('news-container');
    const gridBtn       = document.getElementById('grid-view-btn');
    const listBtn       = document.getElementById('list-view-btn');
  
    // Filter as you type
    searchInput.addEventListener('input', () => {
      const filter = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.news-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(filter) ? '' : 'none';
      });
    });
  
    // View toggles
    gridBtn.addEventListener('click', () => {
      newsContainer.classList.add('grid-view');
      newsContainer.classList.remove('list-view');
      gridBtn.setAttribute('aria-pressed', 'true');
      listBtn.setAttribute('aria-pressed', 'false');
    });
    listBtn.addEventListener('click', () => {
      newsContainer.classList.add('list-view');
      newsContainer.classList.remove('grid-view');
      listBtn.setAttribute('aria-pressed', 'true');
      gridBtn.setAttribute('aria-pressed', 'false');
    });
  });
  