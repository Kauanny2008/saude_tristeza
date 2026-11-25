# Saúde Acessível — Barra do Garças/MT

Aplicação acadêmica demonstrativa para consulta de unidades, campanhas, profissionais, calendário e histórico vacinal. **Os dados incluídos são ilustrativos e precisam de validação oficial antes de uso público.**

## Requisitos
- Node.js 22.5 ou superior (usa `node:sqlite`).
- Navegador atualizado.

## Como executar no Windows

1. Instale o Node.js 22.5 ou superior: https://nodejs.org/.
2. Abra a pasta do projeto no VS Code.
3. Abra um terminal na pasta `api`.
4. Execute `node iniciar-banco.js` para preparar o banco de dados.
5. No mesmo terminal, execute `node --env-file=env src/server.js` para iniciar a API.
6. Abra um segundo terminal na pasta principal do projeto e execute `node frontend/servidor-local.js`.
7. Acesse `http://localhost:5500` no navegador.

Mantenha os dois terminais abertos enquanto utilizar o sistema. Para encerrar, pressione `Ctrl + C` em cada terminal.

## Integração
A interface consulta os endpoints `/api/postos`, `/api/campanhas`, `/api/profissionais`, `/api/eventos`, `/api/calendario-vacinal` e `/api/historico`. Se a API estiver indisponível, a página usa os dados demonstrativos locais e informa o modo de demonstração. Para hospedagem em domínios diferentes, preencha a meta `api-base-url` em `frontend/index.html` com a URL completa da API e configure `CORS_ORIGIN` no servidor.

## Recursos
- Layout responsivo para desktop e celular.
- Preferência de idioma PT-BR, espanhol e inglês (a tradução textual é parcial; nomes próprios e dados cadastrados permanecem no idioma de origem).
- Tema claro/escuro com preferência salva no navegador.
- Manifest e service worker para instalação e cache do shell da aplicação. A API e os dados dinâmicos exigem conexão; o modo offline usa somente dados locais demonstrativos.

## Limitações importantes
- Não há autenticação, prontuário individual, agendamento real, nem integração com sistemas oficiais do SUS.
- O histórico vacinal incluído é fictício/demonstrativo; não representa uma pessoa real.
- Endereços, telefones, horários, disponibilidade de profissionais, campanhas e recomendações devem ser conferidos com a Secretaria Municipal de Saúde e fontes oficiais.
- O projeto não substitui orientação médica nem serviço de emergência. Em emergência, ligue 192 (SAMU) ou procure atendimento de urgência.

## Estrutura
- `frontend/`: HTML, CSS, JavaScript, acessibilidade e PWA.
- `api/`: servidor HTTP, rotas, controllers e models.
- `database/`: schema SQLite e datasets CSV.
- `kauanny-ana-/`: escopo e documentos de requisitos.
