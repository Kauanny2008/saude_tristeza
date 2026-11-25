// Lista de rotas da API: [método, endereço, função do controller]
const posto = require('../controllers/postoController');
const campanha = require('../controllers/campanhaController');
const profissional = require('../controllers/profissionalController');
const evento = require('../controllers/eventoController');
const vacina = require('../controllers/vacinaController');

module.exports = [
  ['GET', /^\/api\/health$/, (req, res) => require('../utils/resposta').enviarJson(res, 200, { status: 'ok', servico: 'Saúde Acessível API' })],
  ['GET', /^\/api\/postos$/, posto.listar],
  ['GET', /^\/api\/postos\/(\d+)$/, posto.buscar],
  ['GET', /^\/api\/campanhas$/, campanha.listar],
  ['GET', /^\/api\/profissionais$/, profissional.listar],
  ['GET', /^\/api\/eventos$/, evento.listar],
  ['GET', /^\/api\/calendario-vacinal$/, vacina.calendario],
  ['GET', /^\/api\/historico$/, vacina.historico]
];
