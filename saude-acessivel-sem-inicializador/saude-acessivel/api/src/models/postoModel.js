const db = require('../database/conexao');
const SELECT = `SELECT p.*,
  COALESCE((SELECT group_concat(nome, '||') FROM posto_servicos s WHERE s.posto_id = p.id), '') AS servicos
  FROM postos p`;
function normalizar(p) {
  if (!p) return p;
  return { ...p, aviso: Boolean(p.aviso), servicos: p.servicos ? p.servicos.split('||') : [] };
}
function listar(status) {
  const rows = status
    ? db.prepare(SELECT + ' WHERE p.status = ? ORDER BY p.id').all(status)
    : db.prepare(SELECT + ' ORDER BY p.id').all();
  return rows.map(normalizar);
}
function buscarPorId(id) { return normalizar(db.prepare(SELECT + ' WHERE p.id = ?').get(id)); }
module.exports = { listar, buscarPorId };
