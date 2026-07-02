# 📊 MODELO DE DADOS - ERD (Entity Relationship Diagram)

**Status**: ✅ Aprovado  
**Data**: 02/07/2026  
**Base de Dados**: MySQL 8.x

---

## 🏗️ DIAGRAMA CONCEITUAL

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIOS & ACESSO                           │
│                                                                     │
│  ┌──────────────┐                                  ┌─────────────┐ │
│  │   Usuario    │                                  │ Perfil      │ │
│  ├──────────────┤                                  ├─────────────┤ │
│  │ id (PK)      │                                  │ id (PK)     │ │
│  │ email        │◄─────────────────────────────────│ nome        │ │
│  │ senha        │ 1:N                              │ descricao   │ │
│  │ ativo        │                                  └─────────────┘ │
│  │ data_criacao │                                                  │
│  └──────────────┘                                                  │
│         │                                                          │
│         │ 1:1 (Usuario tem 1 tipo de perfil)                     │
│         │                                                          │
│  ┌──────▼──────────────┬──────────┬──────────────────────────┐    │
│  │                     │          │                          │    │
│  ▼                     ▼          ▼                          ▼    │
│ Profissional      Paciente   Recepcionista           Administrador│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PROFISSIONAIS & ESPECIALIDADES                   │
│                                                                     │
│  ┌──────────────────────┐          ┌─────────────────────┐        │
│  │  Especialidade       │          │   Profissional      │        │
│  ├──────────────────────┤          ├─────────────────────┤        │
│  │ id (PK)              │          │ id (PK)             │        │
│  │ nome                 │◄─────────│ usuario_id (FK)     │        │
│  │ descricao            │ 1:N      │ especialidade_id(FK)│        │
│  │ ativo                │          │ crm                 │        │
│  └──────────────────────┘          │ crefito             │        │
│                                    │ banco_agencia       │        │
│                                    │ banco_conta         │        │
│                                    │ tipo_pagamento      │        │
│                                    │ valor_consulta      │        │
│                                    │ percentual_receita  │        │
│                                    │ data_cadastro       │        │
│                                    │ ativo               │        │
│                                    └─────────────────────┘        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Horario_Atendimento_Profissional                │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ profissional_id (FK) ◄──────────┐ 1:N                       │ │
│  │ dia_semana (0-6)                │                           │ │
│  │ hora_inicio                     │ Permite múltiplos          │ │
│  │ hora_fim                        │ horários por dia           │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         PACIENTES                                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     Paciente                                 │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ usuario_id (FK)                                             │ │
│  │ cpf (UNIQUE)                                                │ │
│  │ data_nascimento                                             │ │
│  │ sexo                                                        │ │
│  │ telefone                                                    │ │
│  │ endereco                                                    │ │
│  │ numero                                                      │ │
│  │ complemento                                                 │ │
│  │ bairro                                                      │ │
│  │ cidade                                                      │ │
│  │ estado                                                      │ │
│  │ cep                                                         │ │
│  │ alergias                                                    │ │
│  │ antecedentes_medicos                                        │ │
│  │ data_cadastro                                               │ │
│  │ ativo                                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                           1:N                                      │
│                            │                                       │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │             Paciente_PlanoSaude                              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ paciente_id (FK)                                            │ │
│  │ plano_saude_id (FK)                                         │ │
│  │ numero_cobertura (carteira do plano)                        │ │
│  │ data_vigencia_inicio                                        │ │
│  │ data_vigencia_fim                                           │ │
│  │ ativo                                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PLANOS DE SAÚDE                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              PlanoSaude                                      │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ nome                                                         │ │
│  │ descricao                                                    │ │
│  │ ativo                                                        │ │
│  │ data_criacao                                                │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                           1:N                                      │
│                            │                                       │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │          Cobertura_PlanoSaude                                │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ plano_saude_id (FK)                                         │ │
│  │ especialidade_id (FK)                                       │ │
│  │ percentual_cobertura (0-100%)                               │ │
│  │ valor_copay                                                 │ │
│  │ requer_autorizacao (boolean)                                │ │
│  │ ativo                                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      ATENDIMENTOS                                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                   Atendimento                                │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ profissional_id (FK)                                         │ │
│  │ paciente_id (FK)                                             │ │
│  │ paciente_plano_saude_id (FK) [nullable]                     │ │
│  │ especialidade_id (FK)                                        │ │
│  │ data_agendamento                                            │ │
│  │ hora_inicio                                                 │ │
│  │ hora_fim                                                    │ │
│  │ data_realizacao [nullable]                                  │ │
│  │ tipo (PRESENCIAL, TELEMEDICINA)                             │ │
│  │ status (AGENDADO, REALIZADO, CANCELADO, NÃO_COMPARECEU)     │ │
│  │ motivo_cancelamento                                          │ │
│  │ valor_consulta (será recebido antes de atendimento)         │ │
│  │ data_criacao                                                │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                           1:N                                      │
│                            │                                       │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │          Prontuario_Atendimento                              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ atendimento_id (FK)                                         │ │
│  │ anamnese                                                    │ │
│  │ queixa_principal                                             │ │
│  │ historico_presente_doenca                                    │ │
│  │ diagnostico                                                  │ │
│  │ conduta                                                      │ │
│  │ procedimentos_realizados                                     │ │
│  │ observacoes                                                  │ │
│  │ data_criacao                                                │ │
│  │ data_atualizacao                                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │           Prescricao_Atendimento                             │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ atendimento_id (FK)                                         │ │
│  │ medicamento                                                 │ │
│  │ dosagem                                                     │ │
│  │ frequencia                                                  │ │
│  │ duracao_dias                                                │ │
│  │ orientacoes                                                 │ │
│  │ data_criacao                                                │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PAGAMENTOS                                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Pagamento                                 │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ profissional_id (FK)                                         │ │
│  │ atendimento_id (FK) [nullable - múltiplos podem gerar pag] │ │
│  │ mes_referencia (YYYY-MM)                                    │ │
│  │ valor_bruto                                                 │ │
│  │ desconto_clinica                                            │ │
│  │ valor_liquido (valor_bruto - desconto)                      │ │
│  │ status (PENDENTE, PROCESSANDO, PAGO, FALHOU)                │ │
│  │ data_calculo                                                │ │
│  │ data_pagamento                                              │ │
│  │ observacoes                                                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                           1:N                                      │
│                            │                                       │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │       Detalhe_Pagamento                                      │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ pagamento_id (FK)                                            │ │
│  │ atendimento_id (FK)                                         │ │
│  │ valor_atendimento                                            │ │
│  │ tipo_atendimento (particular/com_plano)                      │ │
│  │ plano_saude_id [nullable]                                   │ │
│  │ percentual_cobertura                                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     AUDITORIA & LOGS                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                  Auditoria_Acesso                            │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ id (PK)                                                      │ │
│  │ usuario_id (FK)                                             │ │
│  │ tabela_acesso                                                │ │
│  │ registro_id                                                  │ │
│  │ tipo_acao (SELECT, INSERT, UPDATE, DELETE, DOWNLOAD)        │ │
│  │ dados_anteriores (JSON)                                      │ │
│  │ dados_novos (JSON)                                           │ │
│  │ ip_address                                                  │ │
│  │ user_agent                                                  │ │
│  │ data_hora                                                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 TABELAS - SQL

### 1. USUÁRIOS

```sql
CREATE TABLE usuario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil_id BIGINT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES perfil(id)
);

CREATE TABLE perfil (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true
);
```

### 2. PROFISSIONAL

```sql
CREATE TABLE profissional (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL UNIQUE,
    especialidade_id BIGINT NOT NULL,
    crm VARCHAR(20),
    crefito VARCHAR(20),
    banco_agencia VARCHAR(10),
    banco_conta VARCHAR(20),
    tipo_pagamento ENUM('FIXO_POR_CONSULTA', 'PERCENTUAL_RECEITA', 'AMBOS') DEFAULT 'FIXO_POR_CONSULTA',
    valor_consulta_particular DECIMAL(10,2),
    valor_consulta_plano DECIMAL(10,2),
    percentual_receita DECIMAL(5,2),
    desconto_clinica_percentual DECIMAL(5,2) DEFAULT 20,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (especialidade_id) REFERENCES especialidade(id),
    UNIQUE KEY unique_crm (crm),
    UNIQUE KEY unique_crefito (crefito)
);

CREATE TABLE especialidade (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true
);

CREATE TABLE horario_atendimento_profissional (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    profissional_id BIGINT NOT NULL,
    dia_semana INT DEFAULT 0, -- 0=domingo, 1=segunda, ..., 6=sábado
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    ativo BOOLEAN DEFAULT true,
    FOREIGN KEY (profissional_id) REFERENCES profissional(id) ON DELETE CASCADE,
    UNIQUE KEY unique_horario (profissional_id, dia_semana, hora_inicio, hora_fim)
);
```

### 3. PACIENTE

```sql
CREATE TABLE paciente (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    sexo CHAR(1), -- 'M' ou 'F'
    telefone VARCHAR(15),
    endereco VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(8),
    alergias TEXT,
    antecedentes_medicos TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    INDEX idx_cpf (cpf)
);
```

### 4. PLANO DE SAÚDE

```sql
CREATE TABLE plano_saude (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cobertura_plano_saude (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plano_saude_id BIGINT NOT NULL,
    especialidade_id BIGINT NOT NULL,
    percentual_cobertura DECIMAL(5,2) NOT NULL, -- 0-100
    valor_copay DECIMAL(10,2) DEFAULT 0,
    requer_autorizacao BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    FOREIGN KEY (plano_saude_id) REFERENCES plano_saude(id) ON DELETE CASCADE,
    FOREIGN KEY (especialidade_id) REFERENCES especialidade(id),
    UNIQUE KEY unique_cobertura (plano_saude_id, especialidade_id)
);

CREATE TABLE paciente_plano_saude (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    paciente_id BIGINT NOT NULL,
    plano_saude_id BIGINT NOT NULL,
    numero_cobertura VARCHAR(50) NOT NULL,
    data_vigencia_inicio DATE NOT NULL,
    data_vigencia_fim DATE,
    ativo BOOLEAN DEFAULT true,
    FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE,
    FOREIGN KEY (plano_saude_id) REFERENCES plano_saude(id),
    INDEX idx_paciente_ativo (paciente_id, ativo)
);
```

### 5. ATENDIMENTO

```sql
CREATE TABLE atendimento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    profissional_id BIGINT NOT NULL,
    paciente_id BIGINT NOT NULL,
    paciente_plano_saude_id BIGINT,
    especialidade_id BIGINT NOT NULL,
    data_agendamento DATETIME NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME,
    data_realizacao DATETIME,
    tipo_atendimento ENUM('PRESENCIAL', 'TELEMEDICINA') DEFAULT 'PRESENCIAL',
    status ENUM('AGENDADO', 'REALIZADO', 'CANCELADO', 'NAO_COMPARECEU') DEFAULT 'AGENDADO',
    motivo_cancelamento TEXT,
    valor_consulta DECIMAL(10,2),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true,
    FOREIGN KEY (profissional_id) REFERENCES profissional(id),
    FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    FOREIGN KEY (paciente_plano_saude_id) REFERENCES paciente_plano_saude(id),
    FOREIGN KEY (especialidade_id) REFERENCES especialidade(id),
    INDEX idx_profissional_data (profissional_id, data_agendamento),
    INDEX idx_paciente (paciente_id),
    INDEX idx_status (status)
);

CREATE TABLE prontuario_atendimento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    atendimento_id BIGINT NOT NULL UNIQUE,
    anamnese TEXT,
    queixa_principal TEXT,
    historico_presente_doenca TEXT,
    diagnostico TEXT,
    conduta TEXT,
    procedimentos_realizados TEXT,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (atendimento_id) REFERENCES atendimento(id) ON DELETE CASCADE
);

CREATE TABLE prescricao_atendimento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    atendimento_id BIGINT NOT NULL,
    medicamento VARCHAR(255) NOT NULL,
    dosagem VARCHAR(50),
    frequencia VARCHAR(100),
    duracao_dias INT,
    orientacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atendimento_id) REFERENCES atendimento(id) ON DELETE CASCADE
);
```

### 6. PAGAMENTO

```sql
CREATE TABLE pagamento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    profissional_id BIGINT NOT NULL,
    mes_referencia VARCHAR(7) NOT NULL, -- YYYY-MM
    valor_bruto DECIMAL(15,2) NOT NULL,
    desconto_clinica DECIMAL(15,2) NOT NULL,
    valor_liquido DECIMAL(15,2) NOT NULL,
    status ENUM('PENDENTE', 'PROCESSANDO', 'PAGO', 'FALHOU') DEFAULT 'PENDENTE',
    data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_pagamento TIMESTAMP,
    observacoes TEXT,
    FOREIGN KEY (profissional_id) REFERENCES profissional(id),
    UNIQUE KEY unique_prof_mes (profissional_id, mes_referencia),
    INDEX idx_status (status),
    INDEX idx_mes (mes_referencia)
);

CREATE TABLE detalhe_pagamento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pagamento_id BIGINT NOT NULL,
    atendimento_id BIGINT NOT NULL,
    valor_atendimento DECIMAL(10,2),
    tipo_atendimento ENUM('PARTICULAR', 'COM_PLANO'),
    plano_saude_id BIGINT,
    percentual_cobertura DECIMAL(5,2),
    FOREIGN KEY (pagamento_id) REFERENCES pagamento(id) ON DELETE CASCADE,
    FOREIGN KEY (atendimento_id) REFERENCES atendimento(id),
    FOREIGN KEY (plano_saude_id) REFERENCES plano_saude(id)
);
```

### 7. AUDITORIA

```sql
CREATE TABLE auditoria_acesso (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    tabela_acesso VARCHAR(100),
    registro_id BIGINT,
    tipo_acao VARCHAR(50), -- SELECT, INSERT, UPDATE, DELETE, DOWNLOAD
    dados_anteriores JSON,
    dados_novos JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    INDEX idx_usuario_data (usuario_id, data_hora),
    INDEX idx_tabela (tabela_acesso),
    INDEX idx_tipo_acao (tipo_acao)
);
```

---

## 🔗 RELACIONAMENTOS

| Origem | Destino | Tipo | Cardinalidade |
|--------|---------|------|---------------|
| Usuario | Perfil | N:1 | Muitos usuários, um perfil |
| Profissional | Usuario | 1:1 | Um profissional, um usuário |
| Profissional | Especialidade | N:1 | Muitos prof, uma especialidade |
| Paciente | Usuario | 1:1 | Um paciente, um usuário |
| Paciente | PlanoSaude | N:M | (via Paciente_PlanoSaude) |
| PlanoSaude | Especialidade | N:M | (via Cobertura_PlanoSaude) |
| Atendimento | Profissional | N:1 | Muitos atendimentos, um prof |
| Atendimento | Paciente | N:1 | Muitos atendimentos, um paciente |
| Atendimento | Prontuario | 1:1 | Um atendimento, um prontuário |
| Atendimento | Prescricao | 1:N | Um atendimento, múltiplas prescrições |
| Pagamento | Profissional | N:1 | Muitos pagamentos, um prof |
| Detalhe_Pagamento | Pagamento | N:1 | Muitos detalhes, um pagamento |
| Detalhe_Pagamento | Atendimento | N:1 | Vários detalhes referem ao mesmo atendimento |

---

## ✅ CONSTRAINTS E ÍNDICES

### Constraints principais
- ✅ PK: Todas as tabelas têm chave primária
- ✅ FK: Referências integrais
- ✅ UNIQUE: email, cpf, crm, crefito
- ✅ NOT NULL: Campos obrigatórios

### Índices para performance
- Email (usuário)
- CPF (paciente)
- Profissional + data (agendamentos)
- Status (atendimentos, pagamentos)
- Período (pagamentos, auditoria)

---

## 🔐 DADOS SENSÍVEIS

Campos que **NUNCA** devem ser expostos no frontend:
- ❌ Senha (sempre hashed com BCrypt)
- ❌ Dados bancários (apenas para profissional visualizar seus próprios dados)
- ❌ CPF (mascarado, exceto para admin)
- ✅ Criptografia em rest + transport

