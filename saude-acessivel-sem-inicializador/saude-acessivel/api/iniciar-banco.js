// Inicializa o banco somente quando ele ainda não existe.
// Não apaga nem sobrescreve dados já cadastrados.
// Para recriar um banco de demonstração do zero, faça backup e remova
// manualmente database/saude.db antes de executar npm run iniciar-banco.
const fs = require('fs');
const { CAMINHO_BANCO } = require('./src/config/ambiente');

if (fs.existsSync(CAMINHO_BANCO)) {
  console.log('O banco já existe. Nenhum dado foi apagado ou alterado.');
  console.log('Arquivo:', CAMINHO_BANCO);
  process.exit(0);
}

// A conexão cria o arquivo e executa banco.sql quando a tabela principal não existe.
const db = require('./src/database/conexao');

for (const tabela of ['postos', 'campanhas', 'calendario_vacinal', 'historico_vacinal', 'profissionais', 'eventos']) {
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM ${tabela}`).get();
  console.log(tabela.padEnd(20), total, 'registros');
}

db.close();
console.log('Banco inicializado com sucesso.');
