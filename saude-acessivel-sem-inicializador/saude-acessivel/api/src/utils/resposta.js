// Envia uma resposta em JSON
function enviarJson(res, status, dados) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(dados));
}

module.exports = { enviarJson };
