<?php
// ================================================================
// dxb-ops/contacts.php — Contact Requests List
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/config/db.php';

require_auth();
$db = get_db();

$per_page = 20;
$page     = max(1, (int)($_GET['p'] ?? 1));
$offset   = ($page - 1) * $per_page;
$search   = trim($_GET['q'] ?? '');

$where  = [];
$params = [];
$qs_arr = [];

if ($search !== '') {
    $where[]           = "(name LIKE :search OR email LIKE :search OR subject LIKE :search)";
    $params[':search']  = '%' . $search . '%';
    $qs_arr['q']       = $search;
}

$where_sql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
$qs = http_build_query($qs_arr);
$export_qs = $qs ? '?' . $qs : '';
$qs_with_p = $qs ? '&' . $qs : '';

$count_stmt = $db->prepare("SELECT COUNT(*) FROM contact_requests {$where_sql}");
$count_stmt->execute($params);
$total       = (int)$count_stmt->fetchColumn();
$total_pages = max(1, (int)ceil($total / $per_page));

$params[':limit']  = $per_page;
$params[':offset'] = $offset;

$stmt = $db->prepare("
    SELECT id, name, email, phone, subject, message, created_at
    FROM contact_requests
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

$page_title  = 'Contact Requests';
$active_page = 'contacts';

include __DIR__ . '/partials/header.php';
include __DIR__ . '/partials/sidebar.php';
?>

<div class="main-content">
  <div class="page-header">
    <div>
      <h1>Contact Requests</h1>
      <span class="breadcrumb"><?= number_format($total) ?> total submissions</span>
    </div>
    <div style="display:flex; gap:10px;">
      <a href="/dxb-ops/export-contacts.php<?= $export_qs ?>" class="btn btn-primary btn-sm">📥 Export Filtered CSV</a>
      <a href="/dxb-ops/export-contacts.php" class="btn btn-outline btn-sm">📥 Export All</a>
    </div>
  </div>

  <div class="page-body">
    <div class="card">

      <!-- Filter bar -->
      <form method="GET" class="filter-row">
        <input type="search" name="q" placeholder="Search name, email, subject…"
               value="<?= htmlspecialchars($search) ?>" />
        <button type="submit" class="btn btn-primary btn-sm">Search</button>
        <?php if ($search): ?>
          <a href="/dxb-ops/contacts.php" class="btn btn-outline btn-sm">Clear</a>
        <?php endif; ?>
      </form>

      <!-- Table -->
      <div class="table-wrap">
        <?php if (empty($rows)): ?>
          <div class="empty-state">
            <div class="empty-icon">✉️</div>
            <p>No contact requests found<?= $search ? ' matching your search' : '' ?>.</p>
          </div>
        <?php else: ?>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($rows as $r): ?>
            <tr>
              <td class="td-light"><?= (int)$r['id'] ?></td>
              <td class="td-name"><?= htmlspecialchars($r['name']) ?></td>
              <td class="td-email">
                <a href="mailto:<?= htmlspecialchars($r['email']) ?>"><?= htmlspecialchars($r['email']) ?></a>
              </td>
              <td class="td-light"><?= htmlspecialchars($r['phone'] ?? '—') ?></td>
              <td><?= htmlspecialchars($r['subject'] ?? '—') ?></td>
              <td>
                <span title="<?= htmlspecialchars($r['message']) ?>" style="cursor:help;">
                  <?= htmlspecialchars(mb_substr($r['message'], 0, 80)) ?><?= mb_strlen($r['message']) > 80 ? '…' : '' ?>
                </span>
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

    </div>
  </div>
</div>
</div>
</body>
</html>
