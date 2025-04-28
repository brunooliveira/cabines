-- Migration number: 0001 	 2025-04-28
-- Sistema de Reservas de Cabines de Estudo

-- Remover tabelas existentes se necessário
DROP TABLE IF EXISTS turnos_reservados;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS precos;
DROP TABLE IF EXISTS planos;
DROP TABLE IF EXISTS turnos;
DROP TABLE IF EXISTS cabines;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  telefone TEXT,
  tipo TEXT DEFAULT 'aluno', -- aluno, gestor
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cabines
CREATE TABLE IF NOT EXISTS cabines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero INTEGER UNIQUE NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'disponivel', -- disponivel, manutencao
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de turnos
CREATE TABLE IF NOT EXISTS turnos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  hora_inicio INTEGER NOT NULL,
  hora_fim INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de planos
CREATE TABLE IF NOT EXISTS planos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  duracao_meses INTEGER NOT NULL, -- 1, 3, 6
  descricao TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de preços (relaciona quantidade de turnos com planos)
CREATE TABLE IF NOT EXISTS precos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quantidade_turnos INTEGER NOT NULL,
  plano_id INTEGER NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  custo_retido DECIMAL(10,2) NOT NULL, -- Adicionado custo retido
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plano_id) REFERENCES planos(id)
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  cabine_id INTEGER NOT NULL,
  plano_id INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  custo_retido_total DECIMAL(10,2) NOT NULL, -- Adicionado custo retido total da reserva
  status TEXT DEFAULT 'pendente', -- pendente, confirmada, cancelada
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (cabine_id) REFERENCES cabines(id),
  FOREIGN KEY (plano_id) REFERENCES planos(id)
);

-- Tabela de turnos reservados
CREATE TABLE IF NOT EXISTS turnos_reservados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reserva_id INTEGER NOT NULL,
  turno_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reserva_id) REFERENCES reservas(id),
  FOREIGN KEY (turno_id) REFERENCES turnos(id)
);

-- Tabela para logs de acesso (mantida do template original)
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para contadores (mantida do template original)
CREATE TABLE IF NOT EXISTS counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais

-- Inserir as 34 cabines
INSERT INTO cabines (numero, descricao) VALUES 
(1, 'Cabine 1'), (2, 'Cabine 2'), (3, 'Cabine 3'), (4, 'Cabine 4'), (5, 'Cabine 5'),
(6, 'Cabine 6'), (7, 'Cabine 7'), (8, 'Cabine 8'), (9, 'Cabine 9'), (10, 'Cabine 10'),
(11, 'Cabine 11'), (12, 'Cabine 12'), (13, 'Cabine 13'), (14, 'Cabine 14'), (15, 'Cabine 15'),
(16, 'Cabine 16'), (17, 'Cabine 17'), (18, 'Cabine 18'), (19, 'Cabine 19'), (20, 'Cabine 20'),
(21, 'Cabine 21'), (22, 'Cabine 22'), (23, 'Cabine 23'), (24, 'Cabine 24'), (25, 'Cabine 25'),
(26, 'Cabine 26'), (27, 'Cabine 27'), (28, 'Cabine 28'), (29, 'Cabine 29'), (30, 'Cabine 30'),
(31, 'Cabine 31'), (32, 'Cabine 32'), (33, 'Cabine 33'), (34, 'Cabine 34');

-- Inserir os 4 turnos
INSERT INTO turnos (nome, hora_inicio, hora_fim) VALUES 
('Manhã', 6, 10),
('Meio-dia', 11, 15),
('Tarde', 15, 19),
('Noite', 19, 23);

-- Inserir os planos
INSERT INTO planos (nome, duracao_meses, descricao) VALUES 
('Mensal', 1, 'Plano com duração de 1 mês'),
('Trimestral', 3, 'Plano com duração de 3 meses'),
('Semestral', 6, 'Plano com duração de 6 meses');

-- Inserir os preços para cada combinação de turnos e planos (com custo retido)
-- Plano Mensal
INSERT INTO precos (quantidade_turnos, plano_id, valor, custo_retido) VALUES 
(1, 1, 200.00, 70.00), -- 1 turno, plano mensal
(2, 1, 300.00, 140.00), -- 2 turnos, plano mensal
(3, 1, 400.00, 210.00), -- 3 turnos, plano mensal
(4, 1, 450.00, 280.00); -- 4 turnos, plano mensal

-- Plano Trimestral
INSERT INTO precos (quantidade_turnos, plano_id, valor, custo_retido) VALUES 
(1, 2, 570.00, 210.00), -- 1 turno, plano trimestral
(2, 2, 870.00, 420.00), -- 2 turnos, plano trimestral (Valor corrigido de 855 para 870)
(3, 2, 1170.00, 630.00), -- 3 turnos, plano trimestral (Valor corrigido de 1140 para 1170)
(4, 2, 1320.00, 840.00); -- 4 turnos, plano trimestral (Valor corrigido de 1282.50 para 1320)

-- Plano Semestral
INSERT INTO precos (quantidade_turnos, plano_id, valor, custo_retido) VALUES 
(1, 3, 1080.00, 420.00), -- 1 turno, plano semestral
(2, 3, 1680.00, 840.00), -- 2 turnos, plano semestral (Valor corrigido de 1620 para 1680)
(3, 3, 2280.00, 1260.00), -- 3 turnos, plano semestral (Valor corrigido de 2160 para 2280)
(4, 3, 2580.00, 1680.00); -- 4 turnos, plano semestral (Valor corrigido de 2430 para 2580)

-- Inserir contadores iniciais
INSERT INTO counters (name, value) VALUES 
  ('page_views', 0),
  ('api_calls', 0),
  ('reservas_realizadas', 0);

-- Criar índices para otimização
CREATE INDEX idx_reservas_cabine_id ON reservas(cabine_id);
CREATE INDEX idx_reservas_usuario_id ON reservas(usuario_id);
CREATE INDEX idx_reservas_plano_id ON reservas(plano_id);
CREATE INDEX idx_reservas_datas ON reservas(data_inicio, data_fim);
CREATE INDEX idx_turnos_reservados_reserva_id ON turnos_reservados(reserva_id);
CREATE INDEX idx_turnos_reservados_turno_id ON turnos_reservados(turno_id);
CREATE INDEX idx_precos_plano_id ON precos(plano_id);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_counters_name ON counters(name);
CREATE INDEX idx_usuarios_email ON usuarios(email);
