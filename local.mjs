// Serveur local (sans Netlify) : `node local.mjs` puis http://localhost:8888
// Les données sont écrites dans le dossier ./data (comme avec XAMPP).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.DOCKTEASE_LOCAL_DIR ??= path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
const { default: app } = await import('./netlify/functions/app.mjs');
const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const MIME = { '.css': 'text/css', '.png': 'image/png', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const PORT = Number(process.env.PORT || 8888);

http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const file = path.join(pub, path.normalize(u.pathname));
  if (file.startsWith(pub + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    return fs.createReadStream(file).pipe(res);
  }
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(await req.toArray());
  const r = await app(new Request(u, { method: req.method, headers: req.headers, body }), { ip: req.socket.remoteAddress });
  const headers = {};
  for (const [k, v] of r.headers) headers[k] = k === 'set-cookie' ? r.headers.getSetCookie() : v;
  res.writeHead(r.status, headers);
  res.end(Buffer.from(await r.arrayBuffer()));
}).listen(PORT, () => console.log(`Docktease : http://localhost:${PORT}  (admin / docktease2026)`));
