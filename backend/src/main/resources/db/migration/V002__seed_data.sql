-- ============================================
-- ALLES Clinic Management - Seed Data
-- ============================================

-- ============ INSERT ESPECIALIDADES ============
INSERT INTO especialidades (nome, descricao, ativo) VALUES
('Psicologia', 'Psicologia clínica e terapêutica', true),
('Fisioterapia', 'Fisioterapia e reabilitação', true),
('Nutrição', 'Nutrição e dietética clínica', true);

-- ============ INSERT PLANOS_SAUDE ============
INSERT INTO planos_saude (nome, descricao, ativo) VALUES
('Bradesco Saúde', 'Plano de saúde Bradesco com cobertura completa', true),
('Porto Seguro', 'Plano de saúde Porto Seguro com rede credenciada', true);

-- ============ INSERT USUARIOS (ADMIN) ============
INSERT INTO usuarios (email, senha, ativo, perfil, data_criacao, data_atualizacao) VALUES
('admin@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'ADMIN', NOW(), NOW()),
('gerente@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'GERENTE', NOW(), NOW());

-- ============ INSERT USUARIOS (PROFESSIONALS) ============
INSERT INTO usuarios (email, senha, ativo, perfil, data_criacao, data_atualizacao) VALUES
('psicolo@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PROFISSIONAL', NOW(), NOW()),
('fisio@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PROFISSIONAL', NOW(), NOW()),
('nutri@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PROFISSIONAL', NOW(), NOW()),
('prof2@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PROFISSIONAL', NOW(), NOW()),
('prof3@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PROFISSIONAL', NOW(), NOW());

-- ============ INSERT PROFISSIONAIS ============
INSERT INTO profissionais (usuario_id, especialidade_id, crm, crefito, banco_agencia, banco_conta, tipo_pagamento, 
    valor_consulta_particular, valor_consulta_plano, percentual_receita, desconto_clinica_percentual, ativo) VALUES
(3, 1, 'CRP 12345/06', NULL, '0001', '123456-7', 'FIXO_POR_CONSULTA', 150.00, 120.00, 70.00, 20.00, true),
(4, 2, NULL, 'CREFITO 12345/6', '0001', '123456-8', 'PERCENTUAL_RECEITA', 100.00, 80.00, 60.00, 20.00, true),
(5, 3, NULL, NULL, '0001', '123456-9', 'AMBOS', 120.00, 100.00, 65.00, 20.00, true),
(6, 1, 'CRP 12346/06', NULL, '0001', '123456-10', 'FIXO_POR_CONSULTA', 150.00, 120.00, 70.00, 20.00, true),
(7, 2, NULL, 'CREFITO 12346/6', '0001', '123456-11', 'PERCENTUAL_RECEITA', 100.00, 80.00, 60.00, 20.00, true);

-- ============ INSERT USUARIOS (PATIENTS) ============
INSERT INTO usuarios (email, senha, ativo, perfil, data_criacao, data_atualizacao) VALUES
('paciente1@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente2@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente3@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente4@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente5@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente6@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente7@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente8@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente9@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW()),
('paciente10@alles.com', '$2a$10$tYQmDFlS2dAZWQaQmplqAOEUuWM7j7V/H9DXNfJhD0S7OhNkyPY2m', true, 'PACIENTE', NOW(), NOW());

-- ============ INSERT PACIENTES ============
INSERT INTO pacientes (usuario_id, cpf, data_nascimento, sexo, telefone, endereco, numero, complemento, 
    bairro, cidade, estado, cep, alergias, antecedentes_medicos, ativo) VALUES
(8, '12345678901', '1990-01-15', 'M', '11999999901', 'Rua A', '100', 'Apto 101', 'Centro', 'São Paulo', 'SP', '01000-000', 'Penicilina', NULL, true),
(9, '12345678902', '1985-05-22', 'F', '11999999902', 'Rua B', '200', NULL, 'Vila', 'São Paulo', 'SP', '02000-000', NULL, 'Hipertensão', true),
(10, '12345678903', '1995-03-10', 'M', '11999999903', 'Rua C', '300', 'Apto 201', 'Zona Norte', 'São Paulo', 'SP', '03000-000', NULL, NULL, true),
(11, '12345678904', '1988-07-30', 'F', '11999999904', 'Rua D', '400', NULL, 'Zona Sul', 'São Paulo', 'SP', '04000-000', 'Sulfa', 'Diabetes', true),
(12, '12345678905', '1992-11-18', 'M', '11999999905', 'Rua E', '500', 'Apto 302', 'Leste', 'São Paulo', 'SP', '05000-000', NULL, NULL, true),
(13, '12345678906', '1987-02-14', 'F', '11999999906', 'Rua F', '600', NULL, 'Oeste', 'São Paulo', 'SP', '06000-000', NULL, 'Asma', true),
(14, '12345678907', '1993-09-05', 'M', '11999999907', 'Rua G', '700', 'Apto 401', 'Centro', 'São Paulo', 'SP', '07000-000', 'Iodo', NULL, true),
(15, '12345678908', '1989-12-25', 'F', '11999999908', 'Rua H', '800', NULL, 'Vila', 'São Paulo', 'SP', '08000-000', NULL, NULL, true),
(16, '12345678909', '1994-06-08', 'M', '11999999909', 'Rua I', '900', 'Apto 501', 'Zona Nord', 'São Paulo', 'SP', '09000-000', NULL, 'Colesterol', true),
(17, '12345678910', '1991-04-20', 'F', '11999999910', 'Rua J', '1000', NULL, 'Zona Sul', 'São Paulo', 'SP', '10000-000', 'Amoxicilina', NULL, true);

-- ============ INSERT ATENDIMENTOS (SAMPLE APPOINTMENTS) ============
INSERT INTO atendimentos (paciente_id, profissional_id, data_inicio, data_fim, diagnostico, notas_consulta) VALUES
(1, 1, '2024-07-01 09:00:00', '2024-07-01 10:00:00', 'Ansiedade leve', 'Paciente respondeu bem ao tratamento'),
(2, 2, '2024-07-01 10:00:00', '2024-07-01 11:00:00', 'Dor lombar', 'Iniciado programa de fisioterapia'),
(3, 3, '2024-07-01 14:00:00', '2024-07-01 15:00:00', 'Triagem nutricional', 'Indicações de alimentos específicos'),
(4, 4, '2024-07-02 09:00:00', '2024-07-02 10:00:00', 'Depressão moderada', 'Continuar acompanhamento semanal'),
(5, 5, '2024-07-02 11:00:00', '2024-07-02 12:00:00', 'Lesão de ombro', 'Bom progresso na recuperação'),
(6, 1, '2024-07-03 09:00:00', NULL, NULL, NULL),
(7, 2, '2024-07-03 10:00:00', NULL, NULL, NULL),
(8, 3, '2024-07-04 14:00:00', NULL, NULL, NULL),
(9, 4, '2024-07-05 09:00:00', NULL, NULL, NULL),
(10, 5, '2024-07-05 11:00:00', NULL, NULL, NULL);

-- ============ INSERT PACIENTES_PLANOS_SAUDE ============
INSERT INTO pacientes_planos_saude (paciente_id, plano_saude_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 2),
(5, 1),
(6, 2),
(7, 1),
(8, 2),
(9, 1),
(10, 2);

-- ============ INSERT PAGAMENTOS ============
INSERT INTO pagamentos (profissional_id, atendimento_id, valor, data_pagamento, data_vencimento, status, referencia, descricao) VALUES
(1, 1, 150.00, '2024-07-01', '2024-07-31', 'PAGO', 'PAG001', 'Pagamento por consulta - Julho 2024'),
(2, 2, 100.00, '2024-07-01', '2024-07-31', 'PAGO', 'PAG002', 'Pagamento por consulta - Julho 2024'),
(3, 3, 120.00, '2024-07-01', '2024-07-31', 'PENDENTE', 'PAG003', 'Pagamento por consulta - Julho 2024'),
(4, 4, 150.00, '2024-07-02', '2024-07-31', 'PENDENTE', 'PAG004', 'Pagamento por consulta - Julho 2024'),
(5, 5, 100.00, '2024-07-02', '2024-07-31', 'PAGO', 'PAG005', 'Pagamento por consulta - Julho 2024');
