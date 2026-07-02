const fs = require('fs');
const path = require('path');

const dx101Path = path.resolve(__dirname, '..', 'products', 'dx-101', 'index.html');

if (fs.existsSync(dx101Path)) {
    let content = fs.readFileSync(dx101Path, 'utf8');

    const injectionPoint = '<!-- Request Quote Section -->';
    if (content.includes(injectionPoint) && !content.includes('📡 IT Connectivity & Integration')) {
        const connectivityBlock = `
      <!-- Connectivity & Assets Section -->
      <div>
        <h2 class="product-section-title">📡 IT Connectivity & Integration</h2>
        <div class="intended-use-card" style="margin-bottom: 24px;">
          <p style="margin-bottom: 16px;">The DX 101 features robust bidirectional communication designed for modern laboratory networks. Seamlessly transmit results directly to your LIS/HIS.</p>
          <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 13.5px; color: var(--text-mid); display:flex; flex-direction:column; gap:6px;">
            <li><strong>Protocol:</strong> Universal HL7 Interface</li>
            <li><strong>Network:</strong> Built-in Wi-Fi & 4G cellular data</li>
            <li><strong>Hardware Interfaces:</strong> USB Type-C, Bluetooth (for thermal printers)</li>
            <li><strong>Patient ID:</strong> Integrated QR/Barcode scanning for error-free patient association</li>
          </ul>
        </div>
        
        <h2 class="product-section-title">📥 Documentation</h2>
        <div class="intended-use-card" style="margin-bottom: 32px; padding: 16px;">
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:white; border:1px solid var(--border); border-radius:var(--radius-sm); box-shadow:var(--shadow-sm);">
              <div style="display:flex; align-items:center; gap:14px;">
                <span style="font-size:24px;">📰</span>
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:var(--text-dark);">Product Brochure</div>
                  <div style="font-size:12px; color:var(--text-light); margin-top:2px;">Complete feature list and specifications</div>
                </div>
              </div>
              <a href="../../Dx%20101%20-%20Analyzer.pdf" download class="btn-secondary" style="padding:8px 14px; font-size:12px; font-weight:600; white-space:nowrap;">Download PDF</a>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:white; border:1px solid var(--border); border-radius:var(--radius-sm); box-shadow:var(--shadow-sm);">
              <div style="display:flex; align-items:center; gap:14px;">
                <span style="font-size:24px;">📘</span>
                <div>
                  <div style="font-weight:700; font-size:13.5px; color:var(--text-dark);">Operation Manual</div>
                  <div style="font-size:12px; color:var(--text-light); margin-top:2px;">Detailed setup and LIS configuration guide</div>
                </div>
              </div>
              <a href="../../contact.html?product=DX%20101%20Analyzer&intent=manual_request" class="btn-secondary" style="padding:8px 14px; font-size:12px; font-weight:600; white-space:nowrap;">Request Manual</a>
            </div>
          </div>
        </div>
      </div>
      
      `;
        content = content.replace(injectionPoint, connectivityBlock + injectionPoint);
        
        // Also fix the residual "🛒 Add to Quote Cart"
        if (content.includes('🛒 Add to Quote Cart')) {
            content = content.replace(/🛒 Add to Quote Cart/g, '📄 Add to Quote Request');
        }
        if (content.includes('🛒 Add to Cart')) {
            content = content.replace(/🛒 Add to Cart/g, '📄 Add to Quote Request');
        }
        
        fs.writeFileSync(dx101Path, content, 'utf8');
        console.log('Updated dx-101 page.');
    } else {
        console.log('dx-101 page already updated or missing injection point.');
    }
} else {
    console.log('dx-101 index.html not found.');
}
