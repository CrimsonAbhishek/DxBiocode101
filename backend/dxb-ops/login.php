<?php
// ================================================================
// admin/login.php — Admin Login
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/includes/rate-limit.php';
require_once $base . '/includes/csrf.php';
require_once $base . '/config/db.php';

session_start_secure();

// Already logged in → redirect
if (is_authenticated()) {
    header('Location: /dxb-ops/dashboard.php');
    exit;
}

$error   = '';
$timeout = !empty($_GET['timeout']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    csrf_verify();

    // Rate limit login attempts
    if (!rate_limit_check('admin_login', 5, 900)) {
        $error = 'Too many login attempts. Please wait 15 minutes.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $error = 'Please enter your username and password.';
        } else {
            $db   = get_db();
            $stmt = $db->prepare("SELECT id, username, password_hash FROM admins WHERE username = :u LIMIT 1");
            $stmt->execute([':u' => $username]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password_hash'])) {
                login_admin($admin['username']);
                header('Location: /dxb-ops/dashboard.php');
                exit;
            } else {
                // Consistent timing to prevent timing attacks
                usleep(random_int(200000, 400000));
                $error = 'Invalid username or password.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login — DX BIOCODE</title>
  <link rel="stylesheet" href="/dxb-ops/assets/admin.css" />
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
<div class="login-page">
  <div class="login-box">

    <div class="login-logo">
      <div class="brand">DX BIOCODE</div>
      <div class="sub">Admin Panel</div>
    </div>

    <?php if ($timeout): ?>
      <div class="alert alert-error" style="margin-bottom:16px;">Session expired. Please sign in again.</div>
    <?php endif; ?>

    <?php if ($error): ?>
      <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST" autocomplete="off">
      <?= csrf_field() ?>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required
               value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
               autocomplete="username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password" />
      </div>
      <button type="submit" class="btn-login">Sign In →</button>
    </form>

  </div>
</div>
</body>
</html>
