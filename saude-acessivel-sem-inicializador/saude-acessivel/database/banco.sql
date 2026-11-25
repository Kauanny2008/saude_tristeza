-- Banco de dados: Saúde Acessível (SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS postos (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  bairro    TEXT,
  status    TEXT NOT NULL CHECK (status IN ('aberto','fechado','urgencia')),
  endereco  TEXT,
  telefone  TEXT,
  distancia TEXT,
  horario   TEXT,
  espera    TEXT,
  lotacao   TEXT,
  lat       REAL,
  lng       REAL,
  obs       TEXT,
  aviso     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posto_servicos (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  posto_id INTEGER NOT NULL REFERENCES postos(id) ON DELETE CASCADE,
  nome     TEXT NOT NULL
);

-- inicio/fim NULL = campanha permanente
CREATE TABLE IF NOT EXISTS campanhas (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  icone     TEXT,
  descricao TEXT,
  status    TEXT,
  inicio    TEXT,
  fim       TEXT
);

CREATE TABLE IF NOT EXISTS campanha_locais (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  campanha_id INTEGER NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  local       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calendario_vacinal (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  faixa  TEXT NOT NULL,
  vacina TEXT NOT NULL,
  doses  TEXT,
  obs    TEXT
);

CREATE TABLE IF NOT EXISTS historico_vacinal (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  vacina          TEXT NOT NULL,
  data_aplicacao  TEXT NOT NULL,
  posto           TEXT,
  dose            TEXT
);

CREATE TABLE IF NOT EXISTS profissionais (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nome          TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  categoria     TEXT NOT NULL,
  horario       TEXT,
  posto         TEXT,
  disponivel    INTEGER NOT NULL DEFAULT 1,
  iniciais      TEXT
);

CREATE TABLE IF NOT EXISTS eventos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  data      TEXT NOT NULL,
  titulo    TEXT NOT NULL,
  tipo      TEXT NOT NULL CHECK (tipo IN ('campanha','feriado','evento')),
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS busca (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  rotulo TEXT NOT NULL,
  pagina TEXT NOT NULL,
  icone  TEXT
);

-- =====================  DADOS  =====================

-- postos
INSERT INTO postos (id, nome, bairro, status, endereco, telefone, distancia, horario, espera, lotacao, lat, lng, obs, aviso) VALUES (1, 'UBS Centro', 'Centro', 'aberto', 'Rua Coronel Ponce, 400 — Centro, Barra do Garças/MT', '(66) 3401-1200', '0,3 km', 'Seg–Sex: 7h–17h | Sáb: 7h–12h', '~15 min', 'Moderada', -15.8898, -52.2567, 'Médico disponível normalmente. Vacinação pela manhã.', 0);
INSERT INTO postos (id, nome, bairro, status, endereco, telefone, distancia, horario, espera, lotacao, lat, lng, obs, aviso) VALUES (2, 'UBS Jardim Bandeirantes', 'Jd. Bandeirantes', 'aberto', 'Rua das Acácias, 85 — Jd. Bandeirantes, Barra do Garças/MT', '(66) 3401-2300', '1,5 km', 'Seg–Sex: 7h–17h', '~25 min', 'Alta', -15.895, -52.263, 'Dentista disponível às terças e quintas-feiras.', 1);
INSERT INTO postos (id, nome, bairro, status, endereco, telefone, distancia, horario, espera, lotacao, lat, lng, obs, aviso) VALUES (3, 'UPA 24h', 'Setor Sul', 'urgencia', 'Av. Governador Júlio Campos, s/n — Barra do Garças/MT', '(66) 3401-9900', '2,1 km', '24 horas — 7 dias por semana', 'Triagem imediata', 'Variável', -15.883, -52.249, 'Atendimento contínuo. Levar documento de identidade e cartão SUS.', 0);
INSERT INTO postos (id, nome, bairro, status, endereco, telefone, distancia, horario, espera, lotacao, lat, lng, obs, aviso) VALUES (4, 'UBS Novo Horizonte', 'Novo Horizonte', 'aberto', 'Rua Santos Dumont, 210 — Novo Horizonte, Barra do Garças/MT', '(66) 3401-3400', '2,4 km', 'Seg–Sex: 7h–17h | Sáb: 7h–11h', '~10 min', 'Baixa', -15.9, -52.27, 'Psicologia disponível somente com agendamento prévio.', 0);
INSERT INTO postos (id, nome, bairro, status, endereco, telefone, distancia, horario, espera, lotacao, lat, lng, obs, aviso) VALUES (5, 'Centro de Especialidades Médicas (CEM)', 'Centro', 'aberto', 'Av. Brasil, 1500 — Centro, Barra do Garças/MT', '(66) 3401-4500', '0,9 km', 'Seg–Sex: 7h–17h', '~40 min', 'Alta', -15.886, -52.254, 'Atendimento exclusivo por encaminhamento da UBS.', 1);
INSERT INTO postos (id, nome, bairro, status, endereco, telefone, distancia, horario, espera, lotacao, lat, lng, obs, aviso) VALUES (6, 'UBS Cohabam', 'Cohabam', 'aberto', 'Rua Mato Grosso, 330 — Cohabam, Barra do Garças/MT', '(66) 3401-5600', '3,2 km', 'Seg–Sex: 7h–16h', '~12 min', 'Baixa', -15.907, -52.261, 'Atendimento normal retomado após reforma.', 0);

-- posto_servicos
INSERT INTO posto_servicos (posto_id, nome) VALUES (1, 'Clínico Geral');
INSERT INTO posto_servicos (posto_id, nome) VALUES (1, 'Pediatria');
INSERT INTO posto_servicos (posto_id, nome) VALUES (1, 'Enfermagem');
INSERT INTO posto_servicos (posto_id, nome) VALUES (1, 'Vacinação');
INSERT INTO posto_servicos (posto_id, nome) VALUES (1, 'Curativos');
INSERT INTO posto_servicos (posto_id, nome) VALUES (1, 'Pré-natal');
INSERT INTO posto_servicos (posto_id, nome) VALUES (2, 'Clínico Geral');
INSERT INTO posto_servicos (posto_id, nome) VALUES (2, 'Odontologia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (2, 'Vacinação');
INSERT INTO posto_servicos (posto_id, nome) VALUES (2, 'Enfermagem');
INSERT INTO posto_servicos (posto_id, nome) VALUES (3, 'Urgência/Emergência');
INSERT INTO posto_servicos (posto_id, nome) VALUES (3, 'Raio-X');
INSERT INTO posto_servicos (posto_id, nome) VALUES (3, 'Laboratório');
INSERT INTO posto_servicos (posto_id, nome) VALUES (3, 'Observação');
INSERT INTO posto_servicos (posto_id, nome) VALUES (3, 'Medicação');
INSERT INTO posto_servicos (posto_id, nome) VALUES (3, 'Suturas');
INSERT INTO posto_servicos (posto_id, nome) VALUES (4, 'Fisioterapia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (4, 'Clínico Geral');
INSERT INTO posto_servicos (posto_id, nome) VALUES (4, 'Enfermagem');
INSERT INTO posto_servicos (posto_id, nome) VALUES (4, 'Psicologia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (4, 'Vacinação');
INSERT INTO posto_servicos (posto_id, nome) VALUES (5, 'Cardiologia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (5, 'Ginecologia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (5, 'Ortopedia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (5, 'Dermatologia');
INSERT INTO posto_servicos (posto_id, nome) VALUES (5, 'Nutrição');
INSERT INTO posto_servicos (posto_id, nome) VALUES (5, 'Serviço Social');
INSERT INTO posto_servicos (posto_id, nome) VALUES (6, 'Clínico Geral');
INSERT INTO posto_servicos (posto_id, nome) VALUES (6, 'Vacinação');
INSERT INTO posto_servicos (posto_id, nome) VALUES (6, 'Enfermagem');
INSERT INTO posto_servicos (posto_id, nome) VALUES (6, 'Pré-natal');

-- campanhas
INSERT INTO campanhas (id, nome, icone, descricao, status, inicio, fim) VALUES (1, 'Campanha Dengue 2026', '🦟', 'Vacinação contra dengue (Qdenga) para crianças e adolescentes de 6 a 16 anos. Região do Araguaia em alerta amarelo. Procure o posto mais próximo com cartão SUS.', 'encerrada', '2026-03-01', '2026-06-30');
INSERT INTO campanhas (id, nome, icone, descricao, status, inicio, fim) VALUES (2, 'Vacinação Contra Gripe 2026', '🤧', 'Campanha nacional de vacinação contra influenza. Prioritários: idosos (60+), gestantes, crianças de 6 meses a 6 anos, povos indígenas, puérperas e trabalhadores da saúde.', 'encerrada', '2026-04-14', '2026-05-30');
INSERT INTO campanhas (id, nome, icone, descricao, status, inicio, fim) VALUES (3, 'Multivacinação Infantil 2026', '👶', 'Atualização do cartão vacinal para crianças de 0 a 5 anos. Campanha anual do Ministério da Saúde — sem agendamento necessário. Barra do Garças/MT.', 'encerrada', '2026-06-08', '2026-06-26');
INSERT INTO campanhas (id, nome, icone, descricao, status, inicio, fim) VALUES (4, 'Hepatite B — Adultos', '💉', 'Imunização contra hepatite B para adultos que ainda não completaram o esquema vacinal de 3 doses. Disponível durante todo o ano nos postos.', 'ativa', NULL, NULL);
INSERT INTO campanhas (id, nome, icone, descricao, status, inicio, fim) VALUES (5, 'Vacina BCG Neonatal', '🍼', 'Aplicação da BCG em recém-nascidos. Realizada na maternidade ou no posto nas primeiras 24h de vida. Obrigatória pelo calendário nacional de vacinação.', 'ativa', NULL, NULL);
INSERT INTO campanhas (id, nome, icone, descricao, status, inicio, fim) VALUES (6, 'HPV — Meninas e Meninos 2026', '🎀', 'Vacina HPV quadrivalente para meninas (9–14 anos) e meninos (11–14 anos). Duas doses com intervalo de 6 meses. Disponível durante o ano letivo nas UBS.', 'encerrada', '2026-02-01', '2026-10-31');

-- campanha_locais
INSERT INTO campanha_locais (campanha_id, local) VALUES (1, 'UBS Centro');
INSERT INTO campanha_locais (campanha_id, local) VALUES (1, 'UBS Jd. Bandeirantes');
INSERT INTO campanha_locais (campanha_id, local) VALUES (1, 'UBS Novo Horizonte');
INSERT INTO campanha_locais (campanha_id, local) VALUES (2, 'UBS Centro');
INSERT INTO campanha_locais (campanha_id, local) VALUES (2, 'UBS Novo Horizonte');
INSERT INTO campanha_locais (campanha_id, local) VALUES (2, 'UBS Jd. Bandeirantes');
INSERT INTO campanha_locais (campanha_id, local) VALUES (2, 'UBS Cohabam');
INSERT INTO campanha_locais (campanha_id, local) VALUES (3, 'Todos os postos');
INSERT INTO campanha_locais (campanha_id, local) VALUES (4, 'UBS Centro');
INSERT INTO campanha_locais (campanha_id, local) VALUES (4, 'UBS Novo Horizonte');
INSERT INTO campanha_locais (campanha_id, local) VALUES (4, 'UBS Cohabam');
INSERT INTO campanha_locais (campanha_id, local) VALUES (5, 'UBS Centro');
INSERT INTO campanha_locais (campanha_id, local) VALUES (5, 'UPA 24h');
INSERT INTO campanha_locais (campanha_id, local) VALUES (5, 'UBS Jd. Bandeirantes');
INSERT INTO campanha_locais (campanha_id, local) VALUES (6, 'UBS Centro');
INSERT INTO campanha_locais (campanha_id, local) VALUES (6, 'UBS Jd. Bandeirantes');
INSERT INTO campanha_locais (campanha_id, local) VALUES (6, 'UBS Novo Horizonte');

-- calendario_vacinal
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('Ao nascer', 'BCG + Hepatite B', 'Dose única + 1ª dose', 'Aplicar na maternidade');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('2 meses', 'Pentavalente + VIP + Pneumocócica 10V + Rotavírus', '1ª dose', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('3 meses', 'Meningocócica C', '1ª dose', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('4 meses', 'Pentavalente + VIP + Pneumocócica 10V + Rotavírus', '2ª dose', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('5 meses', 'Meningocócica C', '2ª dose', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('6 meses', 'Pentavalente + VIP + Hepatite B + Influenza', '3ª dose + 1ª dose anual', 'Influenza: dose semestral para crianças até 6 anos');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('9 meses', 'Febre Amarela', 'Dose única', 'Reforço aos 4 anos — Região endêmica MT');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('12 meses', 'Tríplice viral (SCR) + Pneumocócica 10V + Meningocócica C', '1ª dose / Reforço', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('15 meses', 'DTP + VOP + Varicela + Hepatite A + SCR 2ª dose', '1º reforço / Doses', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('4 anos', 'DTP + VOP + Febre Amarela', '2º reforço / Reforço', '');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('9–14 anos', 'HPV Quadrivalente', '2 doses (intervalo 6 meses)', 'Meninas 9–14 / Meninos 11–14 anos');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('Adultos', 'dT + Hepatite B + Febre Amarela', 'Conforme caderneta', 'MT é área endêmica — verificar reforço Febre Amarela');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('Gestantes', 'dTpa + Hepatite B + Influenza', 'Obrigatórias', 'A partir do 5º mês — disponível no CEM e UBS Centro');
INSERT INTO calendario_vacinal (faixa, vacina, doses, obs) VALUES ('Idosos 60+', 'Influenza anual + Pneumocócica 23V + Herpes Zóster', '1× ao ano', 'Campanha gripe 2026: 14/04 a 30/05 — prioridade Barra do Garças');

-- historico_vacinal
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('BCG', '2000-03-15', 'Maternidade Municipal Barra do Garças', 'Dose única');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Hepatite B', '2000-03-15', 'UBS Centro', '1ª dose');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Pentavalente', '2000-05-10', 'UBS Centro', '1ª dose');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Tríplice Viral', '2001-03-20', 'UBS Jd. Bandeirantes', '1ª dose');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Febre Amarela', '2020-02-05', 'UBS Centro', 'Dose única');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('dT', '2022-08-12', 'UBS Novo Horizonte', 'Reforço');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Covid-19', '2021-04-14', 'Drive-thru Ginásio Municipal BG', '1ª dose');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Covid-19', '2021-06-09', 'Drive-thru Ginásio Municipal BG', '2ª dose');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Covid-19 Bivalente', '2023-01-10', 'UBS Centro', 'Dose de reforço');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Influenza 2025', '2025-04-22', 'UBS Novo Horizonte', '1× ao ano');
INSERT INTO historico_vacinal (vacina, data_aplicacao, posto, dose) VALUES ('Influenza 2026', '2026-04-16', 'UBS Centro', '1× ao ano');

-- profissionais
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dr. Rodrigo Mendes', 'Clínico Geral', 'clinico', 'Seg–Sex: 8h–12h / 13h–17h', 'UBS Centro', 1, 'RM');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dra. Ana Lima', 'Pediatra', 'pediatra', 'Seg/Qua/Sex: 14h–18h', 'UBS Jd. Bandeirantes', 1, 'AL');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dr. Carlos Souza', 'Dentista', 'dentista', 'Seg–Sex: 8h–12h', 'UBS Centro', 1, 'CS');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dra. Fernanda Costa', 'Cardiologista', 'cardio', 'Ter/Qui: 9h–12h', 'CEM', 1, 'FC');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dra. Patrícia Rocha', 'Ginecologista', 'gineco', 'Ter/Qui: 7h–12h', 'CEM', 1, 'PR');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dr. Leonardo Faria', 'Clínico Geral', 'clinico', 'Seg–Sex: 13h–18h', 'UBS Novo Horizonte', 0, 'LF');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dra. Juliana Torres', 'Pediatra', 'pediatra', 'Seg/Qua/Sex: 8h–12h', 'UBS Centro', 1, 'JT');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dr. Marcos Vieira', 'Dentista', 'dentista', 'Ter/Qui/Sex: 8h–12h', 'UBS Jd. Bandeirantes', 0, 'MV');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dra. Simone Alves', 'Clínica Geral', 'clinico', 'Seg–Sex: 7h–11h', 'UBS Cohabam', 1, 'SA');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dr. Thiago Batista', 'Cardiologista', 'cardio', 'Seg/Qua: 9h–13h', 'CEM', 1, 'TB');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dra. Camila Nunes', 'Ginecologista', 'gineco', 'Seg/Qua/Sex: 13h–17h', 'UBS Jd. Bandeirantes', 1, 'CN');
INSERT INTO profissionais (nome, especialidade, categoria, horario, posto, disponivel, iniciais) VALUES ('Dr. Eduardo Pires', 'Dentista', 'dentista', 'Seg–Sex: 13h–17h', 'UBS Novo Horizonte', 1, 'EP');

-- eventos
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-12', 'Dia Internacional da Enfermagem', 'evento', 'Comemoração do Dia Internacional da Enfermagem em todos os postos de Barra do Garças.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-14', 'Campanha Gripe em andamento', 'campanha', 'Vacinação contra influenza 2026 em andamento. Prioritários: idosos 60+, gestantes e crianças até 6 anos.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-20', 'Dia Mundial da Hipertensão', 'evento', 'Medição gratuita de pressão arterial em todas as UBS de Barra do Garças. Sem agendamento.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-21', 'Dia Nacional da Hipertensão', 'evento', 'Ações de conscientização sobre hipertensão arterial. Palestras na UBS Centro e UBS Novo Horizonte.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-25', 'Dia do Orgulho Autista — MT', 'evento', 'Evento de conscientização sobre autismo. Informações sobre serviços especializados no CEM.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-30', 'Dia Nacional da Esclerose Múltipla', 'evento', 'Conscientização sobre EM. Fale com seu médico no CEM sobre sintomas e diagnóstico precoce.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-31', 'Dia Mundial Sem Tabaco', 'evento', 'OMS — Ações de conscientização em todos os postos. Apoio para cessação do tabagismo disponível no CEM.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-05-30', 'Encerramento Campanha Gripe 2026', 'campanha', 'Último dia da campanha de vacinação contra influenza 2026.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-04', 'Feriado — Corpus Christi', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-05', 'Dia Mundial do Meio Ambiente', 'evento', 'Ações sobre saúde ambiental e prevenção de doenças transmitidas por vetores em Barra do Garças.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-08', 'Início Multivacinação Infantil 2026', 'campanha', 'Atualização do cartão vacinal para crianças de 0 a 5 anos. Todos os postos de Barra do Garças. Sem agendamento.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-12', 'Dia dos Namorados — Ação de Saúde', 'evento', 'Distribuição de preservativos e material informativo sobre ISTs nas UBS. Testagem rápida disponível.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-21', 'Dia Nacional da Saúde Pública', 'evento', 'Comemorações e atividades educativas nas unidades de saúde de Barra do Garças.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-26', 'Encerramento Multivacinação Infantil', 'campanha', 'Último dia para atualização do cartão vacinal infantil 2026.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-06-27', 'Dia Nacional de Prevenção às DSTs', 'evento', 'Testagem rápida para HIV, sífilis e hepatites disponível gratuitamente nas UBS.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-07-04', 'Independência do Mato Grosso', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-07-28', 'Dia Mundial da Hepatite', 'evento', 'Testagem gratuita para hepatites B e C. Vacinação disponível nas UBS de Barra do Garças.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-08-01', 'Início Agosto Dourado', 'campanha', 'Campanha de incentivo ao aleitamento materno. Ações nas UBS e no CEM durante todo o mês.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-08-09', 'Dia Nacional da Saúde', 'evento', 'Ações de saúde preventiva em todas as UBS. Aferição de PA, glicemia e IMC gratuitos.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-08-31', 'Encerramento Agosto Dourado', 'campanha', 'Último dia da campanha de aleitamento materno 2026.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-09-07', 'Feriado — Independência do Brasil', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-09-21', 'Dia Mundial da Doença de Alzheimer', 'evento', 'Conscientização e informações sobre diagnóstico precoce. Atendimento neurológico via encaminhamento no CEM.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-09-28', 'Dia Mundial do Coração', 'evento', 'Medição gratuita de pressão arterial e glicemia. Palestras sobre saúde cardiovascular na UBS Centro.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-10-01', 'Dia Internacional do Idoso', 'evento', 'Ações especiais para a terceira idade. Vacinação e aferição de PA gratuitas em todos os postos.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-10-02', 'Feriado — Eleições Municipais 2026', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-10-12', 'Feriado — N. Sra. Aparecida', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-10-01', 'Início Outubro Rosa', 'campanha', 'Campanha de prevenção ao câncer de mama. Mamografias e exames preventivos no CEM — agendar via UBS.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-10-31', 'Encerramento Outubro Rosa', 'campanha', 'Último dia do Outubro Rosa 2026.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-11-02', 'Feriado — Finados', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-11-15', 'Feriado — Proclamação da República', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-11-01', 'Início Novembro Azul', 'campanha', 'Campanha de prevenção ao câncer de próstata. Exames e informações disponíveis no CEM via encaminhamento.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-11-14', 'Dia Mundial do Diabetes', 'evento', 'Testagem gratuita de glicemia em todas as UBS de Barra do Garças. Sem agendamento.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-11-20', 'Dia da Consciência Negra', 'evento', 'Ações de saúde da população negra. Informações sobre doenças com maior prevalência na comunidade.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-12-01', 'Dia Mundial da AIDS', 'evento', 'Testagem rápida para HIV e sífilis gratuita nas UBS. Distribuição de preservativos e material informativo.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-12-08', 'Feriado — N. Sra. da Conceição', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');
INSERT INTO eventos (data, titulo, tipo, descricao) VALUES ('2026-12-25', 'Feriado — Natal', 'feriado', 'Postos de saúde fechados. UPA 24h funciona normalmente.');

-- busca
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Postos Próximos', 'postos', 'fas fa-map-marked-alt');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Vacinação — Campanhas', 'vacinacao', 'fas fa-syringe');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Calendário Vacinal', 'vacinacao', 'fas fa-calendar-check');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Meu Histórico Vacinal', 'vacinacao', 'fas fa-history');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Profissionais Hoje', 'profissionais', 'fas fa-user-md');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Calendário da Saúde', 'calendario', 'fas fa-calendar-alt');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Dentista', 'profissionais', 'fas fa-tooth');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Pediatra', 'profissionais', 'fas fa-baby');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Cardiologista', 'profissionais', 'fas fa-heartbeat');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Ginecologista', 'profissionais', 'fas fa-venus');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('UPA 24 Horas', 'postos', 'fas fa-ambulance');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Vacina Dengue 2026', 'vacinacao', 'fas fa-syringe');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Vacina Gripe 2026', 'vacinacao', 'fas fa-syringe');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Avisos', 'home', 'fas fa-bullhorn');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Horários de Hoje', 'home', 'fas fa-clock');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('UBS Centro Barra do Garças', 'postos', 'fas fa-hospital');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('CEM — Centro Especialidades', 'postos', 'fas fa-hospital');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Outubro Rosa', 'vacinacao', 'fas fa-ribbon');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Novembro Azul', 'vacinacao', 'fas fa-ribbon');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('Multivacinação Infantil', 'vacinacao', 'fas fa-baby');
INSERT INTO busca (rotulo, pagina, icone) VALUES ('HPV', 'vacinacao', 'fas fa-syringe');
