const fs = require('fs');
const path = require('path');

const dir = 'd:\\dxbiocode-old';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && name !== 'node_modules' && name !== '.git' && name !== '.next') {
            walkSync(filePath, callback);
        }
    });
}

walkSync(dir, function(filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('.php')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 1. Update CE strips
        content = content.replace(/✔ CE &amp; EU-IVD Approved/g, '✔ ISO 13485 • CE • EU-IVD Approved');
        content = content.replace(/✔ CE & EU-IVD Approved/g, '✔ ISO 13485 • CE • EU-IVD Approved');
        content = content.replace(/✔ CE Certified/g, '✔ ISO 13485 Certified');
        
        // 2. Remove footer social media
        content = content.replace(/<div class="footer-social">[\s\S]*?<\/div>/g, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated CE/Social in', filePath);
        }
    }
});
