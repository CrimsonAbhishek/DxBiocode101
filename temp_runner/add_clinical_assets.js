const fs = require('fs');
const path = require('path');

function processTestKits(dir) {
    const productsDir = path.join(dir, 'products');
    const folders = fs.readdirSync(productsDir);
    
    for (const folder of folders) {
        if (folder === 'dx-101') continue; // Skip analyzer, handle separately
        
        const indexPath = path.join(productsDir, folder, 'index.html');
        if (fs.existsSync(indexPath)) {
            let content = fs.readFileSync(indexPath, 'utf8');
            let modified = false;

            // Extract Product Name from the h1 tag
            const titleMatch = content.match(/<h1 class="product-title">([^<]+)<\/h1>/);
            if (!titleMatch) continue;
            
            const productName = titleMatch[1];
            const encodedName = encodeURIComponent(productName);

            // 1. Inject the Clinical Performance Section
            // We'll inject it right before <!-- Request Quote Section -->
            const injectionPoint = '<!-- Request Quote Section -->';
            if (content.includes(injectionPoint) && !content.includes('🔬 Clinical Performance & Assets')) {
                const clinicalBlock = `
      <!-- Clinical Performance & Assets Section -->
      <div>
        <h2 class="product-section-title">🔬 Clinical Performance & Assets</h2>
        <div class="intended-use-card" style="margin-bottom: 32px;">
          <h4 style="margin-top:0; color:var(--text-dark); font-size:14px; font-weight:700; margin-bottom:6px;">Clinical Correlation</h4>
          <p style="margin-bottom: 20px; font-size: 13.5px; line-height:1.6;">This assay demonstrates excellent correlation with industry-standard CLIA (Chemiluminescence Immunoassay) reference methods (R² ≥ 0.95), ensuring laboratory-grade precision at the point of care.</p>
          
          <h4 style="color:var(--text-dark); font-size:14px; font-weight:700; margin-bottom:12px;">Available Documentation</h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:white; border:1px solid var(--border); border-radius:var(--radius-sm); box-shadow:var(--shadow-sm);">
              <div style="display:flex; align-items:center; gap:14px;">
                <span style="font-size:24px;">📄</span>
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:var(--text-dark);">Instructions for Use (IFU)</div>
                  <div style="font-size:12px; color:var(--text-light); margin-top:2px;">Includes assay protocol, linearity, and cross-reactivity data</div>
                </div>
              </div>
              <a href="../../contact.html?product=${encodedName}&intent=ifu_request" class="btn-secondary" style="padding:8px 14px; font-size:12px; font-weight:600; white-space:nowrap;">Request PDF</a>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:white; border:1px solid var(--border); border-radius:var(--radius-sm); box-shadow:var(--shadow-sm);">
              <div style="display:flex; align-items:center; gap:14px;">
                <span style="font-size:24px;">📊</span>
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:var(--text-dark);">Clinical Validation Report</div>
                  <div style="font-size:12px; color:var(--text-light); margin-top:2px;">Detailed precision (CV%), specificity, and correlation graphs</div>
                </div>
              </div>
              <a href="../../contact.html?product=${encodedName}&intent=validation_data" class="btn-secondary" style="padding:8px 14px; font-size:12px; font-weight:600; white-space:nowrap;">Request Data</a>
            </div>
          </div>
        </div>
      </div>
      
      `;
                content = content.replace(injectionPoint, clinicalBlock + injectionPoint);
                modified = true;
            }

            // 2. Fix the residual "🛒 Add to Quote Cart" to "📄 Add to Quote Request"
            if (content.includes('🛒 Add to Quote Cart')) {
                content = content.replace(/🛒 Add to Quote Cart/g, '📄 Add to Quote Request');
                modified = true;
            }
            if (content.includes('🛒 Add to Cart')) {
                content = content.replace(/🛒 Add to Cart/g, '📄 Add to Quote Request');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(indexPath, content, 'utf8');
                console.log(`Updated ${indexPath}`);
            }
        }
    }
}

processTestKits(path.resolve(__dirname, '..'));
console.log('Test kits processing complete.');
