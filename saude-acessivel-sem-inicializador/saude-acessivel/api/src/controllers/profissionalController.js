const profissionalModel = require('../models/profissionalModel');
const { enviarJson } = require('../utils/resposta');

function listar(req, res, { query }) {
  enviarJson(res, 200, profissionalModel.listar(query.get('categoria')));
}

module.exports = { listar };
