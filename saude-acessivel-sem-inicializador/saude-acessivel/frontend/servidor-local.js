// Servidor local simples para abrir o frontend sem instalar o pacote serve.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 5500;
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname); }
  catch { res.writeHead(400); return res.end('Requisicao invalida'); }

  if (pathname === '/') pathname = '/index.html';
  const arquivo = path.resolve(ROOT, '.' + pathname);
  if (!arquivo.startsWith(ROOT + path.sep) && arquivo !== path.join(ROOT, 'index.html')) {
    res.writeHead(403); return res.end('Acesso negado');
  }

  fs.readFile(arquivo, (erro, conteudo) => {
    if (erro) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Arquivo nao encontrado'); }
    res.writeHead(200, {
      'Content-Type': TIPOS[path.extname(arquivo).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache'
    });
    res.end(conteudo);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Site Saúde Acessível disponível em http://localhost:${PORT}`);
});
