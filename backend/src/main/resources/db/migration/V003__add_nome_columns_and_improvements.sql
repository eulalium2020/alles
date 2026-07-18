-- ============================================
-- ALLES - Migração V003: Adicionar coluna NOME
-- ============================================
-- Objetivo: Adicionar coluna nome onde está faltando para suportar
-- name-based selection nos formulários frontend

-- ============ USUARIOS TABLE ============
ALTER TABLE usuarios ADD COLUMN nome VARCHAR(150) NOT NULL DEFAULT '' AFTER email;
ALTER TABLE usuarios ADD COLUMN cpf VARCHAR(11) DEFAULT NULL AFTER senha;
ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20) DEFAULT NULL AFTER cpf;
ALTER TABLE usuarios DROP COLUMN cpf; -- Remove duplicado (já estava em pacientes/profissionais)
ALTER TABLE usuarios DROP COLUMN telefone; -- Remove duplicado

ALTER TABLE usuarios ADD COLUMN cpf VARCHAR(11) DEFAULT NULL UNIQUE AFTER email;
ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20) DEFAULT NULL AFTER cpf;

CREATE INDEX idx_usuarios_nome ON usuarios(nome);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);

-- ============ PROFISSIONAIS TABLE ============
ALTER TABLE profissionais ADD COLUMN valor_fixo DECIMAL(10, 2) DEFAULT 0 AFTER valor_consulta_plano;
ALTER TABLE profissionais ADD COLUMN horarios_atendimento VARCHAR(255) DEFAULT NULL AFTER desconto_clinica_percentual;

CREATE INDEX idx_profissionais_crm_completo ON profissionais(crm, id);

-- ============ ATENDIMENTOS TABLE ============
ALTER TABLE atendimentos ADD COLUMN tipo_atendimento VARCHAR(50) NOT NULL DEFAULT 'PRESENCIAL' AFTER profissional_id;
ALTER TABLE atendimentos ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'AGENDADO' AFTER tipo_atendimento;
ALTER TABLE atendimentos ADD COLUMN anotacoes TEXT DEFAULT NULL AFTER notas_consulta;
ALTER TABLE atendimentos ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_criacao;

-- Renomear coluna para padronização
ALTER TABLE atendimentos CHANGE COLUMN data_inicio data_hora DATETIME NOT NULL;

CREATE INDEX idx_atendimentos_status ON atendimentos(status);
CREATE INDEX idx_atendimentos_tipo ON atendimentos(tipo_atendimento);
CREATE INDEX idx_atendimentos_data_hora ON atendimentos(data_hora);

-- ============ PACIENTES TABLE ============
ALTER TABLE pacientes ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_cadastro;

-- ============ PROFISSIONAIS TABLE - Data Updates ============
ALTER TABLE profissionais ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_cadastro;

-- ============ PLANOS_SAUDE TABLE - Data Updates ============
ALTER TABLE planos_saude ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_criacao;

-- ============ PERFIS TABLE (NOVO) ============
CREATE TABLE IF NOT EXISTS perfis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_nome (nome),
    KEY idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed de perfis padrão
INSERT INTO perfis (nome, descricao, ativo) VALUES
('ADMIN', 'Administrador do sistema com acesso completo', true),
('PROFISSIONAL', 'Profissional de saúde (médico, dentista, etc)', true),
('PACIENTE', 'Paciente que utiliza a clínica', true),
('GERENTE', 'Gerente administrativo da clínica', true)
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);

-- ============ ESPECIALIDADES - Melhorias ============
ALTER TABLE especialidades ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER descricao;

-- ============ PAGAMENTOS - Melhorias ============
ALTER TABLE pagamentos ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER data_criacao;

CREATE INDEX idx_pagamentos_data_atualizacao ON pagamentos(data_atualizacao);
