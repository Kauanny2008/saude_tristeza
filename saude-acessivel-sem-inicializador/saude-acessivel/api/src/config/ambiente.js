// Configurações do projeto
const path = require('path');

module.exports = {
  PORTA: process.env.PORT || 3000,
  CAMINHO_BANCO: path.join(__dirname, '..', '..', '..', 'database', 'saude.db'),
  CAMINHO_SQL: path.join(__dirname, '..', '..', '..', 'database', 'banco.sql')
};
