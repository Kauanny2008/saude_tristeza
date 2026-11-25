const postoModel = require('../models/postoModel');
const { enviarJson } = require('../utils/resposta');

function listar(req, res, { query }) {
  const status = query.get('status');
  if (status && !['aberto', 'fechado', 'urgencia'].includes(status)) {
    return enviarJson(res, 400, { erro: 'Status inválido. Use aberto, fechado ou urgencia.' });
  }
  enviarJson(res, 200, postoModel.listar(status));
}

function buscar(req, res, { params }) {
  const posto = postoModel.buscarPorId(Number(params[0]));
  if (!posto) return enviarJson(res, 404, { erro: 'Posto não encontrado' });
  enviarJson(res, 200, posto);
}

module.exports = { listar, buscar };
