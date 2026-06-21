const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT_DIR = path.resolve(__dirname, '..');
const htmlFiles = [
  'index.html',
  'products.html',
  'service.html',
  'about.html',
  'contact.html',
  'careers.html',
  'quote.html'
];

console.log('--- STARTING HTML METADATA EXTRACTOR ---');

htmlFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(content);
  const doc = dom.window.document;

  // Title
  const title = doc.querySelector('title')?.textContent || 'N/A';

  // Meta description
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'N/A';

  // H1 tags
  const h1s = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent.trim().replace(/\s+/g, ' '));

  // H2 tags
  const h2s = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent.trim().replace(/\s+/g, ' '));

  // Word count (strip scripts, styles, tag markers)
  // Let's get body text content
  const bodyText = doc.body ? doc.body.textContent : '';
  const words = bodyText.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  console.log(`\n========================================`);
  console.log(`PAGE: ${file}`);
  console.log(`TITLE: ${title}`);
  console.log(`DESCRIPTION: ${metaDesc}`);
  console.log(`H1 TAGS (${h1s.length}):`, h1s);
  console.log(`H2 TAGS (${h2s.length}):`, h2s.slice(0, 15)); // show first 15 H2s
  console.log(`WORD COUNT: ${wordCount}`);
});

console.log('--- COMPLETED ---');
