<?php
// admin/partials/sidebar.php
// Usage: include after header.php; set $active_page to current page key
$active = $active_page ?? '';
?>
<aside class="sidebar">
  <div class="sidebar-brand">
    <div class="logo-text">DX BIOCODE</div>
    <div class="logo-sub">Admin Panel</div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section-label">Main</div>
    <a href="/dxb-ops/dashboard.php" class="nav-link <?= $active === 'dashboard' ? 'active' : '' ?>">
      <span class="nav-icon">📊</span> Dashboard
    </a>
    <a href="/dxb-ops/quotes.php" class="nav-link <?= $active === 'quotes' ? 'active' : '' ?>">
      <span class="nav-icon">📋</span> Quote Requests
    </a>
    <a href="/dxb-ops/contacts.php" class="nav-link <?= $active === 'contacts' ? 'active' : '' ?>">
      <span class="nav-icon">✉️</span> Contact Requests
    </a>

    <div class="nav-section-label">Site</div>
    <a href="/" class="nav-link" target="_blank">
      <span class="nav-icon">🌐</span> View Website
    </a>
  </nav>

  <div class="sidebar-footer">
    <div class="sidebar-user">
      Signed in as<strong><?= htmlspecialchars(current_admin()) ?></strong>
    </div>
    <a href="/dxb-ops/logout.php" class="btn-logout">Sign Out</a>
  </div>
</aside>
