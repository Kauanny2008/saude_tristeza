const vacinaModel = require('../models/vacinaModel');
const { enviarJson } = require('../utils/resposta');

const calendario = (req, res) => enviarJson(res, 200, vacinaModel.calendario());
const historico = (req, res) => enviarJson(res, 200, vacinaModel.historico());

module.exports = { calendario, historico };
