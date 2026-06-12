<?php
// ================================================================
// setup/create-admin.php
// ================================================================

declare(strict_types=1);

$base = dirname(__DIR__);
require_once $base . '/config/db.php';

$message = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm  = $_POST['confirm'] ?? '';
    $secret   = $_POST['secret'] ?? '';

    if ($secret !== 'dxbiocode-setup-2024') {
        $message = 'Invalid setup secret.';
    } elseif (empty($username) || empty($password)) {
        $message = 'Username and password are required.';
    } elseif ($password !== $confirm) {
        $message = 'Passwords do not match.';
    } elseif (strlen($password) < 10) {
        $message = 'Password must be at least 10 characters.';
    } else {
        $db = get_db();
        $stmt = $db->prepare("SELECT id FROM admins WHERE username = :u");
        $stmt->execute([':u' => $username]);
        if ($stmt->fetch()) {
            $message = 'Username already exists.';
        } else {
            $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt = $db->prepare("INSERT INTO admins (username, password_hash) VALUES (:u, :h)");
            $stmt->execute([':u' => $username, ':h' => $hash]);
            header('Location: /dxb-ops/login.php');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Setup Admin</title>
<style>
  body { font-family: sans-serif; background: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin:0; }
  .box { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); width: 350px; }
  h1 { font-size: 20px; margin-top: 0; }
  .warn { font-size: 13px; color: #b91c1c; background: #fef2f2; padding: 10px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #fecaca; }
  label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #374151; }
  input { width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box; }
  button { width: 100%; padding: 10px; background: #9b2fc8; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; }
  .msg { font-size: 13px; margin-bottom: 15px; padding: 10px; border-radius: 4px; }
  .error { color: #b91c1c; background: #fef2f2; }
  .ok { color: #047857; background: #ecfdf5; }
</style>
</head>
<body>
<div class="box">
  <h1>Create Admin Account</h1>
  <div class="warn">⚠️ Delete this file after use. Do not leave it accessible on the live server.</div>
  <?php if ($message): ?>
    <div class="msg <?= $success ? 'ok' : 'error' ?>"><?= htmlspecialchars($message) ?></div>
  <?php endif; ?>
  <?php if (!$success): ?>
  <form method="POST">
    <label>Setup Secret</label>
    <input type="password" name="secret" required placeholder="Hint: look in DEPLOYMENT.md" />
    <label>Username</label>
    <input type="text" name="username" required />
    <label>Password (min 10 chars)</label>
    <input type="password" name="password" required />
    <label>Confirm Password</label>
    <input type="password" name="confirm" required />
    <button type="submit">Create Admin</button>
  </form>
  <?php endif; ?>
</div>
</body>
</html>
