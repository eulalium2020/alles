-- ============================================
-- ALLES - Migração V004: Sincronização de schema
-- ============================================
-- Objetivo: alinhar bancos que já tinham V003 antiga aplicada
-- (ex.: "normalize admin password") com as entidades atuais.

-- ========= usuarios =========
SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'nome'),
    'SELECT 1',
    'ALTER TABLE usuarios ADD COLUMN nome VARCHAR(150) NOT NULL DEFAULT '''' AFTER email'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'cpf'),
    'SELECT 1',
    'ALTER TABLE usuarios ADD COLUMN cpf VARCHAR(11) NULL AFTER nome'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'telefone'),
    'SELECT 1',
    'ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20) NULL AFTER cpf'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========= atendimentos =========
SET @has_data_inicio = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'atendimentos' AND column_name = 'data_inicio'
);
SET @has_data_hora = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'atendimentos' AND column_name = 'data_hora'
);
SET @sql = IF(@has_data_hora = 0 AND @has_data_inicio = 1,
              'ALTER TABLE atendimentos CHANGE COLUMN data_inicio data_hora DATETIME NOT NULL',
              'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'atendimentos' AND column_name = 'tipo_atendimento'),
    'SELECT 1',
    'ALTER TABLE atendimentos ADD COLUMN tipo_atendimento VARCHAR(50) NOT NULL DEFAULT ''PRESENCIAL'' AFTER profissional_id'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'atendimentos' AND column_name = 'status'),
    'SELECT 1',
    'ALTER TABLE atendimentos ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT ''AGENDADO'' AFTER tipo_atendimento'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'atendimentos' AND column_name = 'anotacoes'),
    'SELECT 1',
    'ALTER TABLE atendimentos ADD COLUMN anotacoes TEXT NULL AFTER notas_consulta'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'atendimentos' AND column_name = 'data_atualizacao'),
    'SELECT 1',
    'ALTER TABLE atendimentos ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_criacao'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========= profissionais =========
SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'profissionais' AND column_name = 'valor_fixo'),
    'SELECT 1',
    'ALTER TABLE profissionais ADD COLUMN valor_fixo DECIMAL(10,2) NULL AFTER tipo_pagamento'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'profissionais' AND column_name = 'horarios_atendimento'),
    'SELECT 1',
    'ALTER TABLE profissionais ADD COLUMN horarios_atendimento VARCHAR(255) NULL AFTER desconto_clinica_percentual'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'profissionais' AND column_name = 'data_atualizacao'),
    'SELECT 1',
    'ALTER TABLE profissionais ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_cadastro'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========= pacientes =========
SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'pacientes' AND column_name = 'data_atualizacao'),
    'SELECT 1',
    'ALTER TABLE pacientes ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_cadastro'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========= especialidades =========
SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'especialidades' AND column_name = 'data_atualizacao'),
    'SELECT 1',
    'ALTER TABLE especialidades ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER descricao'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========= planos_saude =========
SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'planos_saude' AND column_name = 'data_atualizacao'),
    'SELECT 1',
    'ALTER TABLE planos_saude ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_criacao'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ========= pagamentos =========
SET @sql = (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'pagamentos' AND column_name = 'data_atualizacao'),
    'SELECT 1',
    'ALTER TABLE pagamentos ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_criacao'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
