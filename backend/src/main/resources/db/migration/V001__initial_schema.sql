-- ============================================
-- ALLES Clinic Management - Initial Schema
-- ============================================

-- ============ USUARIOS TABLE ============
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    perfil VARCHAR(50) NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_email (email),
    KEY idx_perfil (perfil),
    KEY idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ ESPECIALIDADES TABLE ============
CREATE TABLE especialidades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    
    KEY idx_nome (nome),
    KEY idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ PROFISSIONAIS TABLE ============
CREATE TABLE profissionais (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL UNIQUE,
    especialidade_id BIGINT,
    crm VARCHAR(20) UNIQUE,
    crefito VARCHAR(20) UNIQUE,
    banco_agencia VARCHAR(20),
    banco_conta VARCHAR(30),
    tipo_pagamento VARCHAR(50),
    valor_consulta_particular DECIMAL(10, 2),
    valor_consulta_plano DECIMAL(10, 2),
    percentual_receita DECIMAL(5, 2),
    desconto_clinica_percentual DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT true,
    
    CONSTRAINT fk_profissional_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_profissional_especialidade FOREIGN KEY (especialidade_id) 
        REFERENCES especialidades(id) ON DELETE SET NULL,
    
    KEY idx_crm (crm),
    KEY idx_crefito (crefito),
    KEY idx_especialidade (especialidade_id),
    KEY idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ PACIENTES TABLE ============
CREATE TABLE pacientes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE,
    sexo CHAR(1),
    telefone VARCHAR(20),
    endereco VARCHAR(150),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    cep VARCHAR(10),
    alergias TEXT,
    antecedentes_medicos TEXT,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT true,
    
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE RESTRICT,
    
    KEY idx_cpf (cpf),
    KEY idx_email (usuario_id),
    KEY idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ ATENDIMENTOS TABLE ============
CREATE TABLE atendimentos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    paciente_id BIGINT NOT NULL,
    profissional_id BIGINT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    diagnostico TEXT,
    notas_consulta TEXT,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_atendimento_paciente FOREIGN KEY (paciente_id) 
        REFERENCES pacientes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_atendimento_profissional FOREIGN KEY (profissional_id) 
        REFERENCES profissionais(id) ON DELETE RESTRICT,
    
    KEY idx_paciente (paciente_id),
    KEY idx_profissional (profissional_id),
    KEY idx_data_inicio (data_inicio),
    KEY idx_data_fim (data_fim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ PLANOS_SAUDE TABLE ============
CREATE TABLE planos_saude (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_nome (nome),
    KEY idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ PAGAMENTOS TABLE ============
CREATE TABLE pagamentos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    profissional_id BIGINT NOT NULL,
    atendimento_id BIGINT,
    valor DECIMAL(10, 2) NOT NULL,
    data_pagamento DATE NOT NULL,
    data_vencimento DATE,
    status VARCHAR(50) NOT NULL,
    referencia VARCHAR(50),
    descricao TEXT,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pagamento_profissional FOREIGN KEY (profissional_id) 
        REFERENCES profissionais(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pagamento_atendimento FOREIGN KEY (atendimento_id) 
        REFERENCES atendimentos(id) ON DELETE SET NULL,
    
    KEY idx_profissional (profissional_id),
    KEY idx_status (status),
    KEY idx_data_pagamento (data_pagamento),
    KEY idx_referencia (referencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ SEQUENCE TABLE (for Flyway) ============
CREATE TABLE pacientes_planos_saude (
    paciente_id BIGINT NOT NULL,
    plano_saude_id BIGINT NOT NULL,
    
    PRIMARY KEY (paciente_id, plano_saude_id),
    CONSTRAINT fk_paciente_plano FOREIGN KEY (paciente_id) 
        REFERENCES pacientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_plano_paciente FOREIGN KEY (plano_saude_id) 
        REFERENCES planos_saude(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
