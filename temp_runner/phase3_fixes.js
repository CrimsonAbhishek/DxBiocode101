const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            // skip node_modules and .git
            if (file === 'node_modules' || file === '.git' || file === 'Backend') continue;
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Remove Top Bar Cert Strip
            const topBarRegex = /<div style="display:flex;align-items:center;gap:10px;">\s*<span class="ce-strip">✔ ISO 13485 • CE • EU-IVD Approved<\/span>\s*<span class="top-bar-badge">India's First Handheld Multi-Parameter POCT<\/span>\s*<\/div>/g;
            if (topBarRegex.test(content)) {
                content = content.replace(topBarRegex, `<div style="display:flex;align-items:center;gap:10px;">\n      <span class="top-bar-badge">India's First Handheld Multi-Parameter POCT</span>\n    </div>`);
                modified = true;
            }

            // Also check for the exact text without flex container just in case
            if (content.includes('<span class="ce-strip">✔ ISO 13485 • CE • EU-IVD Approved</span>')) {
                // If it's still there and wasn't caught by the regex above, remove it directly if it's right before the badge
                content = content.replace(/<span class="ce-strip">✔ ISO 13485 • CE • EU-IVD Approved<\/span>\s*(<span class="top-bar-badge">)/g, '$1');
                modified = true;
            }

            // 2. Add Social Media to Footer Bottom
            const footerBottomRegex = /<div class="footer-bottom">\s*<span>([^<]+)<\/span>\s*<\/div>/g;
            if (footerBottomRegex.test(content)) {
                content = content.replace(footerBottomRegex, `<div class="footer-bottom">\n      <span>$1</span>\n      <div class="footer-social" style="display:flex;gap:16px;">\n        <a href="https://www.linkedin.com/company/dxbiocode" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style="color:rgba(255,255,255,0.6);transition:color 0.2s;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>\n        <a href="https://youtube.com/@dxbiocode" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style="color:rgba(255,255,255,0.6);transition:color 0.2s;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>\n      </div>\n    </div>`);
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(path.resolve(__dirname, '..'));
console.log('Done.');
