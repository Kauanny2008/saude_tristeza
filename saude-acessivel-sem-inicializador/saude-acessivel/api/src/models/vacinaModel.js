const db = require('../database/conexao');
const calendario = () => db.prepare('SELECT * FROM calendario_vacinal ORDER BY id').all();
const historico = () => db.prepare('SELECT vacina, data_aplicacao, posto, dose FROM historico_vacinal ORDER BY data_aplicacao').all()
  .map(h => ({ ...h, data: h.data_aplicacao ? h.data_aplicacao.split('-').reverse().join('/') : '' }));
module.exports = { calendario, historico };
