const fs = require('fs');
const path = require('path');

const dir = 'd:\\dxbiocode-old';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && name !== 'node_modules' && name !== '.git') {
            walkSync(filePath, callback);
        }
    });
}

const oldCartSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
const newQuoteSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 8 9"></polyline></svg>';

walkSync(dir, function(filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('.php')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        content = content.replace(/aria-label="Shopping cart"/g, 'aria-label="Quote Request"');
        content = content.split(oldCartSvg).join(newQuoteSvg);

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated icons in', filePath);
        }
    }
});
