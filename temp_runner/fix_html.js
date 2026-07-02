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

walkSync(dir, function(filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('.php')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Replace Total: ₹0
        content = content.replace(/<div class="cart-total"><span>Total:<\/span><span class="cart-total-price" id="cart-total-price">₹0<\/span><\/div>/g, '');
        content = content.replace(/<div class="cart-total"><span>Total:<\/span><span class="cart-total-price" id="cart-total-price">₹0<\/span><\/div>/g, '');
        
        // Replace <h3>🛒 Your Cart</h3>
        content = content.replace(/<h3>🛒 Your Cart<\/h3>/g, '<h3>📄 Quotation Summary</h3>');

        // Change "Add to Cart" to "Add to Quote Request" / "Add to Quote List"
        // in index.html, products.html
        content = content.replace(/🛒 Add to Cart/g, '📄 Add to Quote Request');
        content = content.replace(/Add to Cart/g, 'Add to Quote Request');
        content = content.replace(/🛒 Shop Products/g, '📄 View Catalog');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
