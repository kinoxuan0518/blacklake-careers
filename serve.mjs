import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';

// Minimal static server for previewing the site (no build needed).
// Supports: --port/-p <n>, --host/-H <addr>, or a bare positional port.
const args = process.argv.slice(2);
let port = 7100;
let host = '0.0.0.0';
for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--port' || args[i] === '-p') && args[i + 1]) port = Number(args[++i]);
  else if ((args[i] === '--host' || args[i] === '-H') && args[i + 1]) host = args[++i];
  else if (/^\d+$/.test(args[i])) port = Number(args[i]);
}

const root = process.cwd();
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join(root, p));
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      return res.end('forbidden');
    }
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(port, host, () => console.log(`blacklake-careers preview: http://${host}:${port}/`));
