const db = require('../database/conexao');
function listar(especialidade) {
  const rows = especialidade
    ? db.prepare('SELECT * FROM profissionais WHERE categoria = ? ORDER BY nome').all(especialidade)
    : db.prepare('SELECT * FROM profissionais ORDER BY nome').all();
  return rows.map(p => ({ ...p, esp: p.especialidade, init: p.iniciais, disponivel: Boolean(p.disponivel) }));
}
module.exports = { listar };
