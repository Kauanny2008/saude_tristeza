const db = require('../database/conexao');
function listar(mes) {
  const rows = mes
    ? db.prepare('SELECT * FROM eventos WHERE data LIKE ? ORDER BY data').all(mes + '%')
    : db.prepare('SELECT * FROM eventos ORDER BY data').all();
  return rows.map(e => ({ ...e, desc: e.descricao }));
}
module.exports = { listar };
