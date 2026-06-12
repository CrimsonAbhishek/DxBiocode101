<?php
// ================================================================
// dxb-ops/dashboard.php
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/config/db.php';

require_auth();
$db = get_db();

// ── Stats ─────────────────────────────────────────────────────
$stats = [
    'quotes'         => (int)$db->query("SELECT COUNT(*) FROM quote_requests")->fetchColumn(),
    'contacts'       => (int)$db->query("SELECT COUNT(*) FROM contact_requests")->fetchColumn(),
    'new_leads'      => (int)$db->query("SELECT COUNT(*) FROM quote_requests WHERE status = 'new'")->fetchColumn(),
    'closed_leads'   => (int)$db->query("SELECT COUNT(*) FROM quote_requests WHERE status = 'closed'")->fetchColumn(),
    'quotes_month'   => (int)$db->query("SELECT COUNT(*) FROM quote_requests WHERE created_at >= DATE_FORMAT(NOW() ,'%Y-%m-01')")->fetchColumn(),
    'contacts_month' => (int)$db->query("SELECT COUNT(*) FROM contact_requests WHERE created_at >= DATE_FORMAT(NOW() ,'%Y-%m-01')")->fetchColumn(),
];

// ── Most Requested Products ───────────────────────────────────
// We parse the JSON column from quote_requests. In a large DB, a separate table would be better,
// but for this scale, pulling the JSON into PHP is fine.
$json_rows = $db->query("SELECT products_json FROM quote_requests WHERE products_json IS NOT NULL AND products_json != '[]'")->fetchAll(PDO::FETCH_COLUMN);
$product_counts = [];
foreach ($json_rows as $json) {
    $items = json_decode($json, true);
    if (is_array($items)) {
        foreach ($items as $item) {
            $name = $item['product'] ?? '';
            $qty  = (int)($item['quantity'] ?? 1);
            if ($name) {
                if (!isset($product_counts[$name])) $product_counts[$name] = 0;
                $product_counts[$name] += $qty;
            }
        }
    }
}
arsort($product_counts);
$top_products = array_slice($product_counts, 0, 5, true);

// ── Recent Submissions ────────────────────────────────────────
$recent_quotes = $db->query("
    SELECT id, name, company, email, created_at, status
    FROM quote_requests
    ORDER BY created_at DESC LIMIT 5
")->fetchAll();

$recent_contacts = $db->query("
    SELECT id, name, subject, created_at
    FROM contact_requests
    ORDER BY created_at DESC LIMIT 5
")->fetchAll();

$page_title  = 'Dashboard';
$active_page = 'dashboard';

include __DIR__ . '/partials/header.php';
include __DIR__ . '/partials/sidebar.php';
?>

<div class="main-content">
  <div class="page-header">
    <div>
      <h1>Dashboard Overview</h1>
      <span class="breadcrumb">Welcome back, <?= htmlspecialchars($_SESSION['admin_username'] ?? 'Admin') ?></span>
    </div>
  </div>

  <div class="page-body">
    <!-- STATS GRID -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="color:#3a7bd5; background:rgba(58,123,213,0.1);">📋</div>
        <div class="stat-info">
          <span class="stat-label">Total Quotes</span>
          <span class="stat-value"><?= number_format($stats['quotes']) ?></span>
          <span class="stat-desc"><?= $stats['quotes_month'] ?> this month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color:#9b2fc8; background:rgba(155,47,200,0.1);">✉️</div>
        <div class="stat-info">
          <span class="stat-label">Total Contacts</span>
          <span class="stat-value"><?= number_format($stats['contacts']) ?></span>
          <span class="stat-desc"><?= $stats['contacts_month'] ?> this month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color:#e91e63; background:rgba(233,30,99,0.1);">✨</div>
        <div class="stat-info">
          <span class="stat-label">New Leads</span>
          <span class="stat-value"><?= number_format($stats['new_leads']) ?></span>
          <span class="stat-desc">Awaiting contact</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="color:#4caf50; background:rgba(76,175,80,0.1);">✓</div>
        <div class="stat-info">
          <span class="stat-label">Closed Leads</span>
          <span class="stat-value"><?= number_format($stats['closed_leads']) ?></span>
          <span class="stat-desc">Successfully processed</span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- RECENT QUOTES -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Quote Requests</h2>
          <a href="/dxb-ops/quotes.php" class="btn btn-outline btn-sm">View All</a>
        </div>
        <div class="table-wrap">
          <?php if (empty($recent_quotes)): ?>
            <p style="padding:24px; color:#6b7280; text-align:center;">No recent quote requests.</p>
          <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($recent_quotes as $q): ?>
              <tr>
                <td class="td-name"><?= htmlspecialchars($q['name']) ?></td>
                <td class="td-light"><?= htmlspecialchars($q['company'] ?? '—') ?></td>
                <td><span class="badge badge-<?= $q['status'] ?>"><?= ucfirst($q['status']) ?></span></td>
                <td class="td-light"><?= date('d M', strtotime($q['created_at'])) ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
          <?php endif; ?>
        </div>
      </div>

      <!-- TOP PRODUCTS -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Most Requested Products</h2>
        </div>
        <div class="table-wrap">
          <?php if (empty($top_products)): ?>
            <p style="padding:24px; color:#6b7280; text-align:center;">No product data available yet.</p>
          <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align:right;">Requests</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($top_products as $name => $count): ?>
              <tr>
                <td class="td-name"><?= htmlspecialchars($name) ?></td>
                <td style="text-align:right; font-weight:700; color:#3a7bd5;"><?= $count ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
          <?php endif; ?>
        </div>
      </div>
    </div>

    <!-- RECENT CONTACTS -->
    <div class="card" style="margin-top:24px;">
      <div class="card-header">
        <h2 class="card-title">Recent Contact Submissions</h2>
        <a href="/dxb-ops/contacts.php" class="btn btn-outline btn-sm">View All</a>
      </div>
      <div class="table-wrap">
        <?php if (empty($recent_contacts)): ?>
          <p style="padding:24px; color:#6b7280; text-align:center;">No recent contact requests.</p>
        <?php else: ?>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($recent_contacts as $c): ?>
            <tr>
              <td class="td-name"><?= htmlspecialchars($c['name']) ?></td>
              <td><?= htmlspecialchars($c['subject'] ?? '—') ?></td>
              <td class="td-light"><?= date('d M', strtotime($c['created_at'])) ?></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <?php endif; ?>
      </div>
    </div>

  </div>
</div>
</div>
</body>
</html>
