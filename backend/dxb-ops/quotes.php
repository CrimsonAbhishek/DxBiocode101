<?php
// ================================================================
// dxb-ops/quotes.php — Quote Requests List
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/config/db.php';

require_auth();
$db = get_db();

// ── Pagination ────────────────────────────────────────────────
$per_page = 20;
$page     = max(1, (int)($_GET['p'] ?? 1));
$offset   = ($page - 1) * $per_page;

// ── Filters ───────────────────────────────────────────────────
$search       = trim($_GET['q'] ?? '');
$status       = trim($_GET['status'] ?? '');
$company_type = trim($_GET['company_type'] ?? '');
$valid_statuses = ['new', 'contacted', 'quoted', 'closed'];
$valid_types    = ['Hospital', 'Clinic', 'Laboratory', 'Distributor', 'Research Center', 'Other'];

$where  = [];
$params = [];
$qs_arr = []; // query string array for links

if ($search !== '') {
    $where[]         = "(name LIKE :search OR email LIKE :search OR company LIKE :search)";
    $params[':search'] = '%' . $search . '%';
    $qs_arr['q']     = $search;
}
if ($status !== '' && in_array($status, $valid_statuses)) {
    $where[]          = "status = :status";
    $params[':status'] = $status;
    $qs_arr['status'] = $status;
}
if ($company_type !== '' && in_array($company_type, $valid_types)) {
    $where[]                = "company_type = :company_type";
    $params[':company_type'] = $company_type;
    $qs_arr['company_type']  = $company_type;
}

$where_sql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
$qs = http_build_query($qs_arr);
$export_qs = $qs ? '?' . $qs : '';
$qs_with_p = $qs ? '&' . $qs : '';

// ── Total count ───────────────────────────────────────────────
$count_stmt = $db->prepare("SELECT COUNT(*) FROM quote_requests {$where_sql}");
$count_stmt->execute($params);
$total      = (int)$count_stmt->fetchColumn();
$total_pages = max(1, (int)ceil($total / $per_page));

// ── Rows ──────────────────────────────────────────────────────
$params[':limit']  = $per_page;
$params[':offset'] = $offset;

$stmt = $db->prepare("
    SELECT id, name, company, company_type, email, phone, country, message, products_json, status, internal_notes, created_at
    FROM quote_requests
    {$where_sql}
    ORDER BY created_at DESC
    LIMIT :limit OFFSET :offset
");
$stmt->bindValue(':limit',  $per_page, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset,   PDO::PARAM_INT);
foreach ($params as $k => $v) {
    if ($k === ':limit' || $k === ':offset') continue;
    $stmt->bindValue($k, $v);
}
$stmt->execute();
$rows = $stmt->fetchAll();

$page_title  = 'Quote Requests';
$active_page = 'quotes';

include __DIR__ . '/partials/header.php';
include __DIR__ . '/partials/sidebar.php';
?>

<div class="main-content">
  <div class="page-header">
    <div>
      <h1>Quote Requests</h1>
      <span class="breadcrumb"><?= number_format($total) ?> total submissions</span>
    </div>
    <div style="display:flex; gap:10px;">
      <a href="/dxb-ops/export-quotes.php<?= $export_qs ?>" class="btn btn-primary btn-sm">📥 Export Filtered CSV</a>
      <a href="/dxb-ops/export-quotes.php" class="btn btn-outline btn-sm">📥 Export All</a>
    </div>
  </div>

  <div class="page-body">
    <div class="card">

      <!-- Filter bar -->
      <form method="GET" class="filter-row">
        <input type="search" name="q" placeholder="Search name, email, company…"
               value="<?= htmlspecialchars($search) ?>" />
        
        <select name="company_type">
          <option value="">All Facilities</option>
          <?php foreach ($valid_types as $t): ?>
            <option value="<?= $t ?>" <?= $company_type === $t ? 'selected' : '' ?>>
              <?= htmlspecialchars($t) ?>
            </option>
          <?php endforeach; ?>
        </select>

        <select name="status">
          <option value="">All Statuses</option>
          <?php foreach ($valid_statuses as $s): ?>
            <option value="<?= $s ?>" <?= $status === $s ? 'selected' : '' ?>>
              <?= ucfirst($s) ?>
            </option>
          <?php endforeach; ?>
        </select>
        
        <button type="submit" class="btn btn-primary btn-sm">Filter</button>
        <?php if ($search || $status || $company_type): ?>
          <a href="/dxb-ops/quotes.php" class="btn btn-outline btn-sm">Clear</a>
        <?php endif; ?>
      </form>

      <!-- Table -->
      <div class="table-wrap">
        <?php if (empty($rows)): ?>
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <p>No quote requests found<?= $search || $status || $company_type ? ' matching your filter' : '' ?>.</p>
          </div>
        <?php else: ?>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name / Company</th>
              <th>Contact</th>
              <th>Products & Msg</th>
              <th>Status & Notes</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($rows as $r):
              $products = json_decode($r['products_json'] ?? '[]', true) ?: [];
            ?>
            <tr style="vertical-align:top;">
              <td class="td-light"><?= (int)$r['id'] ?></td>
              <td>
                <div class="td-name"><?= htmlspecialchars($r['name']) ?></div>
                <?php if ($r['company']): ?>
                  <div style="margin-top:2px;font-weight:600;color:#374151;"><?= htmlspecialchars($r['company']) ?></div>
                <?php endif; ?>
                <?php if ($r['company_type']): ?>
                  <div class="td-light" style="margin-top:2px;font-size:12px;"><?= htmlspecialchars($r['company_type']) ?></div>
                <?php endif; ?>
              </td>
              <td>
                <div class="td-email"><a href="mailto:<?= htmlspecialchars($r['email']) ?>"><?= htmlspecialchars($r['email']) ?></a></div>
                <?php if ($r['phone']): ?>
                  <div class="td-light"><?= htmlspecialchars($r['phone']) ?></div>
                <?php endif; ?>
                <?php if ($r['country']): ?>
                  <div class="td-light" style="margin-top:4px;">📍 <?= htmlspecialchars($r['country']) ?></div>
                <?php endif; ?>
              </td>
              <td>
                <?php if (!empty($products)): ?>
                  <ul class="product-list" style="margin-bottom:8px;">
                    <?php foreach ($products as $p): ?>
                      <li>
                        <?= htmlspecialchars($p['product'] ?? '') ?>
                        <span class="qty">×<?= (int)($p['quantity'] ?? 1) ?></span>
                      </li>
                    <?php endforeach; ?>
                  </ul>
                <?php endif; ?>
                <?php if ($r['message']): ?>
                  <div style="font-size:12px;color:#4b5563;background:#f3f4f6;padding:6px 8px;border-radius:4px;max-height:80px;overflow-y:auto;">
                    <?= nl2br(htmlspecialchars($r['message'])) ?>
                  </div>
                <?php endif; ?>
              </td>
              <td>
                <select class="status-select"
                        style="margin-bottom:8px;width:100%;"
                        data-id="<?= (int)$r['id'] ?>"
                        onchange="updateQuote(this, 'status')">
                  <?php foreach ($valid_statuses as $s): ?>
                    <option value="<?= $s ?>" <?= $r['status'] === $s ? 'selected' : '' ?>>
                      <?= ucfirst($s) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
                <textarea class="notes-input"
                          placeholder="Add internal notes..."
                          data-id="<?= (int)$r['id'] ?>"
                          onchange="updateQuote(this, 'notes')"
                          style="width:100%;font-size:12px;padding:6px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;min-height:50px;"><?= htmlspecialchars($r['internal_notes'] ?? '') ?></textarea>
                <div class="save-status" id="save-status-<?= $r['id'] ?>" style="font-size:11px;color:#10b981;margin-top:4px;display:none;">Saved!</div>
              </td>
              <td class="td-light" style="white-space:nowrap;">
                <?= date('d M Y', strtotime($r['created_at'])) ?><br>
                <span style="font-size:11px;"><?= date('H:i', strtotime($r['created_at'])) ?></span>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <?php endif; ?>
      </div>

      <!-- Pagination -->
      <?php if ($total_pages > 1): ?>
      <div class="pagination">
        <span class="page-info">Page <?= $page ?> of <?= $total_pages ?></span>
        <?php if ($page > 1): ?>
          <a href="?p=<?= $page - 1 ?><?= $qs_with_p ?>" class="page-link">← Prev</a>
        <?php endif; ?>
        <?php for ($i = max(1, $page - 2); $i <= min($total_pages, $page + 2); $i++): ?>
          <a href="?p=<?= $i ?><?= $qs_with_p ?>"
             class="page-link <?= $i === $page ? 'active' : '' ?>"><?= $i ?></a>
        <?php endfor; ?>
        <?php if ($page < $total_pages): ?>
          <a href="?p=<?= $page + 1 ?><?= $qs_with_p ?>" class="page-link">Next →</a>
        <?php endif; ?>
      </div>
      <?php endif; ?>

    </div><!-- /card -->
  </div><!-- /page-body -->
</div><!-- /main-content -->
</div><!-- /admin-layout -->

<script>
function updateQuote(el, type) {
  const id    = el.dataset.id;
  const value = el.value;
  const payload = { id: id };
  
  if (type === 'status') { payload.status = value; }
  else if (type === 'notes') { payload.internal_notes = value; }

  const statusMsg = document.getElementById('save-status-' + id);

  fetch('/dxb-ops/update-quote.php', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(d => {
    if (!d.success) { 
        alert('Failed to save.'); 
        if(type === 'status') el.value = el.dataset.prev || el.value; 
    } else {
        if(type === 'status') el.dataset.prev = value;
        statusMsg.style.display = 'block';
        setTimeout(() => statusMsg.style.display = 'none', 2000);
    }
  })
  .catch(() => alert('Network error.'));
}

// Store initial values for rollback
document.querySelectorAll('.status-select').forEach(s => { s.dataset.prev = s.value; });
</script>
</body>
</html>
