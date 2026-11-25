const db = require('../database/conexao');

function listar() {
  return db.prepare(`
    SELECT c.*,
      COALESCE((SELECT group_concat(local, '||') FROM campanha_locais cl WHERE cl.campanha_id = c.id), '') AS locais
    FROM campanhas c ORDER BY c.id
  `).all().map(c => {
    const hoje = new Date().toISOString().slice(0, 10);
    let status = c.status || 'ativa';
    if (c.fim && c.fim < hoje) status = 'encerrada';
    else if (c.inicio && c.inicio > hoje) status = 'breve';
    return { ...c, status, postos: c.locais ? c.locais.split('||') : [] };
  });
}

module.exports = { listar };
