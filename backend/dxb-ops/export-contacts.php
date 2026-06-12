<?php
// ================================================================
// dxb-ops/export-contacts.php — CSV Export for Contacts
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/config/db.php';

require_auth();
$db = get_db();

// ── Filters (match contacts.php) ──────────────────────────────
$search = trim($_GET['q'] ?? '');

$where  = [];
$params = [];

if ($search !== '') {
    $where[]         = "(name LIKE :search OR email LIKE :search OR subject LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}

$where_sql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$stmt = $db->prepare("
    SELECT id, name, email, phone, subject, message, created_at
    FROM contact_requests
    {$where_sql}
    ORDER BY created_at DESC
");
$stmt->execute($params);

// ── Output CSV ────────────────────────────────────────────────
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="dxbiocode-contacts-' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

// BOM for Excel UTF-8 support
fputs($output, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

fputcsv($output, [
    'ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Date Submitted'
]);

function sanitize_csv_field($field) {
    if ($field === null || $field === '') return '';
    $field = (string)$field;
    if (in_array($field[0], ['=', '+', '-', '@'], true)) {
        return "'" . $field;
    }
    return $field;
}

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $csv_row = [
        $row['id'],
        $row['name'],
        $row['email'],
        $row['phone'] ?? '',
        $row['subject'] ?? '',
        $row['message'] ?? '',
        $row['created_at']
    ];

    fputcsv($output, array_map('sanitize_csv_field', $csv_row));
}

fclose($output);
exit;
