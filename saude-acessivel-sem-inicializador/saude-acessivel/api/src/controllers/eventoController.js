const eventoModel = require('../models/eventoModel');
const { enviarJson } = require('../utils/resposta');
function listar(req, res, { query }) {
  const mes = query.get('mes');
  if (mes && !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) {
    return enviarJson(res, 400, { erro: 'Parâmetro mes inválido. Use AAAA-MM.' });
  }
  enviarJson(res, 200, eventoModel.listar(mes));
}
module.exports = { listar };
