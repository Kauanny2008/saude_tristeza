// Conexão com o banco SQLite. Se o banco não existe, cria a partir do banco.sql
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const { CAMINHO_BANCO, CAMINHO_SQL } = require('../config/ambiente');

const db = new DatabaseSync(CAMINHO_BANCO);

const existe = db.prepare("SELECT name FROM sqlite_master WHERE name = 'postos'").get();
if (!existe) {
  db.exec(fs.readFileSync(CAMINHO_SQL, 'utf8'));
  console.log('Banco criado a partir de database/banco.sql');
}

module.exports = db;
