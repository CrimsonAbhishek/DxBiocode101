<?php
// ================================================================
// dxb-ops/export-quotes.php — CSV Export for Quotes
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/config/db.php';

require_auth();
$db = get_db();

// ── Filters (match quotes.php) ────────────────────────────────
$search       = trim($_GET['q'] ?? '');
$status       = trim($_GET['status'] ?? '');
$company_type = trim($_GET['company_type'] ?? '');
$valid_statuses = ['new', 'contacted', 'quoted', 'closed'];
$valid_types    = ['Hospital', 'Clinic', 'Laboratory', 'Distributor', 'Research Center', 'Other'];

$where  = [];
$params = [];

if ($search !== '') {
    $where[]         = "(name LIKE :search OR email LIKE :search OR company LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}
if ($status !== '' && in_array($status, $valid_statuses)) {
    $where[]          = "status = :status";
    $params[':status'] = $status;
}
if ($company_type !== '' && in_array($company_type, $valid_types)) {
    $where[]                = "company_type = :company_type";
    $params[':company_type'] = $company_type;
}

$where_sql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$stmt = $db->prepare("
    SELECT id, name, company, company_type, email, phone, country, products_json, product_count, message, status, internal_notes, created_at
    FROM quote_requests
    {$where_sql}
    ORDER BY created_at DESC
");
$stmt->execute($params);

// ── Output CSV ────────────────────────────────────────────────
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="dxbiocode-quotes-' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

// BOM for Excel UTF-8 support
fputs($output, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

fputcsv($output, [
    'ID', 'Name', 'Company', 'Company Type', 'Email', 'Phone', 'Country',
    'Products', 'Total Qty', 'Message', 'Status', 'Internal Notes', 'Date Submitted'
]);

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $products_str = '';
    $products = json_decode($row['products_json'] ?? '[]', true);
    if (is_array($products)) {
        $p_arr = [];
        foreach ($products as $p) {
            $p_arr[] = ($p['product'] ?? '') . ' (x' . ($p['quantity'] ?? 1) . ')';
        }
        $products_str = implode(', ', $p_arr);
    }

    fputcsv($output, [
        $row['id'],
        $row['name'],
        $row['company'] ?? '',
        $row['company_type'] ?? '',
        $row['email'],
        $row['phone'] ?? '',
        $row['country'] ?? '',
        $products_str,
        $row['product_count'],
        $row['message'] ?? '',
        $row['status'],
        $row['internal_notes'] ?? '',
        $row['created_at']
    ]);
}

fclose($output);
exit;
