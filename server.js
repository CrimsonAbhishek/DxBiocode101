const path = require('path');

function getFs() {
  const load = new Function("req", "return req('fs');");
  return load(require);
}

function getHttp() {
  const load = new Function("req", "return req('http');");
  return load(require);
}

function getHttps() {
  const load = new Function("req", "return req('https');");
  return load(require);
}

const PORT = process.env.PORT || 8080;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

// ── Rate Limiting ──────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // max requests per window per IP
const rateLimitMap = new Map();

function getRateLimitKey(req) {
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(req) {
  const key = getRateLimitKey(req);
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ── Request Handler ────────────────────────────────────────────
function handleRequest(req, res) {
  // Rate limiting
  if (isRateLimited(req)) {
    res.writeHead(429, { 'Content-Type': 'text/plain', 'Retry-After': '60' });
    res.end('Too Many Requests');
    return;
  }

  // Only allow GET and HEAD methods for static file server
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  console.log(`${req.method} ${req.url}`);

  // Security headers on every response
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  let urlPath = req.url.split('?')[0].split('#')[0];

  // Decode URI and resolve to prevent path traversal
  try {
    urlPath = decodeURIComponent(urlPath);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  // ── Limit URL Path Length ───────────────────────────────────
  if (urlPath.length > 512) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request - URL Path Too Long');
    return;
  }

  const rootDir = path.resolve(__dirname);
  let filePath = path.resolve(rootDir, '.' + urlPath);

  // ── Path Traversal Protection ──────────────────────────────
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Block access to sensitive files/directories
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const blockedPrefixes = ['.git', '.env', 'node_modules', 'backend', '.htaccess'];
  if (blockedPrefixes.some(prefix => relativePath === prefix || relativePath.startsWith(prefix + '/'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  serveStaticFile(filePath, res);
}

function serveStaticFile(filePath, res) {
  const fsModule = getFs();
  fsModule.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
      return;
    }

    if (stats.isDirectory()) {
      const indexFilePath = path.join(filePath, 'index.html');
      fsModule.stat(indexFilePath, (errInner, statsInner) => {
        if (errInner) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found');
          return;
        }
        serveFile(indexFilePath, statsInner, res);
      });
    } else {
      serveFile(filePath, stats, res);
    }
  });
}

function serveFile(filePath, stats, res) {
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stats.size
  });

  const fsModule = getFs();
  const stream = fsModule.createReadStream(filePath);
  stream.on('error', (err) => {
    console.error('Stream error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      res.end();
    }
  });
  stream.pipe(res);
}

// ── Server Creation ────────────────────────────────────────────
let server;

if (USE_HTTPS) {
  // For HTTPS, provide paths to your TLS certificate and key via env vars
  const fsModule = getFs();
  const sslOptions = {
    key: fsModule.readFileSync(process.env.SSL_KEY_PATH || './ssl/key.pem'),
    cert: fsModule.readFileSync(process.env.SSL_CERT_PATH || './ssl/cert.pem'),
  };
  const httpsModule = getHttps();
  server = httpsModule.createServer(sslOptions, handleRequest);
} else {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Running HTTP in production is not allowed. Please enable HTTPS.');
  }
  // Development-only HTTP server — production should use HTTPS via reverse proxy
  console.warn('⚠️  Running in HTTP mode (development only). Use HTTPS in production.');
  const httpModule = getHttp();
  server = httpModule.createServer(handleRequest);
}

server.listen(PORT, () => {
  const protocol = USE_HTTPS ? 'https' : 'http';
  console.log(`Server running at ${protocol}://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
