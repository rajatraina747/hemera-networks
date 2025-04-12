// build.js
const fs = require('fs');
const path = require('path');

// 1. Load articles from JSON
const rawData = fs.readFileSync('data/articles.json', 'utf8');
let articles = JSON.parse(rawData);

// 2. Sort articles by date desc
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// 3. Read template files
const indexTemplate = fs.readFileSync('templates/index.template.html', 'utf8');
const categoryTemplate = fs.readFileSync('templates/category.template.html', 'utf8');
const articleTemplate = fs.readFileSync('templates/article.template.html', 'utf8');

// Make sure dist folder exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 4. Build the homepage
// We'll create HTML snippets for the "latest" articles
let latestArticlesHTML = '';
articles.forEach(article => {
  const articleLink = `article-${article.id}.html`;
  latestArticlesHTML += `
    <div class="article">
      <h2><a href="${articleLink}">${article.title}</a></h2>
      <p>${article.summary}</p>
      <small>Category: ${article.category}</small>
    </div>
  `;
});

// Insert that into the index template
let finalIndex = indexTemplate.replace('<!-- ARTICLES_PLACEHOLDER -->', latestArticlesHTML);

// Write out `index.html`
fs.writeFileSync(path.join('dist', 'index.html'), finalIndex);

// 5. Build category pages
// Get unique categories
const categories = [...new Set(articles.map(a => a.category))];

categories.forEach(categoryName => {
  // Filter articles for this category
  const catArticles = articles.filter(a => a.category === categoryName);

  let categoryArticlesHTML = '';
  catArticles.forEach(article => {
    const articleLink = `../article-${article.id}.html`;
    categoryArticlesHTML += `
      <div class="article">
        <h2><a href="${articleLink}">${article.title}</a></h2>
        <p>${article.summary}</p>
      </div>
    `;
  });
  
  // Replace placeholders
  let finalCategoryPage = categoryTemplate
    .replace('<!-- CATEGORY_NAME -->', categoryName)
    .replace('<!-- CATEGORY_ARTICLES_PLACEHOLDER -->', categoryArticlesHTML);

  // For each category, we can build a file like "sport.html"
  const fileName = categoryName.toLowerCase() + '.html';
  fs.writeFileSync(path.join('dist', fileName), finalCategoryPage);
});

// 6. Build individual article pages
articles.forEach(article => {
  let singleArticlePage = articleTemplate
    .replace('<!-- ARTICLE_TITLE -->', article.title)
    .replace('<!-- ARTICLE_SUBHEADING -->', article.subheading || '')
    .replace('<!-- ARTICLE_IMAGE_URL -->', article.image_url || '')
    .replace('<!-- ARTICLE_CONTENT -->', article.content);

  const articleFilename = `article-${article.id}.html`;
  fs.writeFileSync(path.join('dist', articleFilename), singleArticlePage);
});

console.log('Build complete!');
