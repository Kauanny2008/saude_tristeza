const campanhaModel = require('../models/campanhaModel');
const { enviarJson } = require('../utils/resposta');

function listar(req, res) {
  enviarJson(res, 200, campanhaModel.listar());
}

module.exports = { listar };
