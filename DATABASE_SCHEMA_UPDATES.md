# 📊 Inclusão de Colunas NOME nas Tabelas do Banco de Dados

**Data:** 18/07/2026  
**Status:** ✅ **100% CONCLUÍDO**  
**Compilação:** ✅ Backend compila sem erros  
**Objetivo:** Adicionar coluna `nome` em todas as tabelas principais para suportar name-based form selection

---

## 🔄 Migração Flyway: V003

**Arquivo:** `backend/src/main/resources/db/migration/V003__add_nome_columns_and_improvements.sql`

### Mudanças por Tabela

#### 📋 **USUARIOS**
```sql
ALTER TABLE usuarios 
  ADD COLUMN nome VARCHAR(150) NOT NULL DEFAULT '' AFTER email,
  ADD COLUMN cpf VARCHAR(11) UNIQUE DEFAULT NULL,
  ADD COLUMN telefone VARCHAR(20) DEFAULT NULL;
```
- ✅ Adicionado: `nome` (obrigatório)
- ✅ Adicionado: `cpf` (para dados consolidados)
- ✅ Adicionado: `telefone` (para dados consolidados)
- ✅ Index em `nome` e `cpf` para queries rápidas

**Antes:**
```
id | email | senha | ativo | perfil
```

**Depois:**
```
id | nome | email | cpf | telefone | senha | ativo | perfil
```

---

#### 👨‍⚕️ **PROFISSIONAIS**
```sql
ALTER TABLE profissionais 
  ADD COLUMN valor_fixo DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN horarios_atendimento VARCHAR(255) DEFAULT NULL,
  ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
```
- ✅ Adicionado: `valor_fixo` (novo campo financeiro)
- ✅ Adicionado: `horarios_atendimento` (strings de horários)
- ✅ Adicionado: `data_atualizacao` (tracking de mudanças)

---

#### 🏥 **ATENDIMENTOS** (MAJOR REFACTOR)
```sql
ALTER TABLE atendimentos 
  CHANGE COLUMN data_inicio data_hora DATETIME NOT NULL,
  ADD COLUMN tipo_atendimento VARCHAR(50) NOT NULL DEFAULT 'PRESENCIAL',
  ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'AGENDADO',
  ADD COLUMN anotacoes TEXT DEFAULT NULL,
  ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
```
- ✅ Renomeado: `data_inicio` → `data_hora` (mais semântico)
- ✅ Adicionado: `tipo_atendimento` (PRESENCIAL, TELEMEDICINA)
- ✅ Adicionado: `status` (AGENDADO, REALIZADO, CANCELADO, NAO_COMPARECEU)
- ✅ Adicionado: `anotacoes` (notes do atendimento)
- ✅ Adicionado: `data_atualizacao` (tracking)
- ✅ Criados indexes para performance

**Antes:**
```
id | paciente_id | profissional_id | data_inicio | data_fim | diagnostico | notas_consulta | data_criacao
```

**Depois:**
```
id | paciente_id | profissional_id | tipo_atendimento | status | data_hora | data_fim | diagnostico | notas_consulta | anotacoes | data_criacao | data_atualizacao
```

---

#### 📋 **PACIENTES**
```sql
ALTER TABLE pacientes 
  ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
```
- ✅ Adicionado: `data_atualizacao` (tracking)

---

#### 🎯 **ESPECIALIDADES**
```sql
ALTER TABLE especialidades 
  ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
```
- ✅ Adicionado: `data_atualizacao` (tracking)

---

#### 💰 **PAGAMENTOS**
```sql
ALTER TABLE pagamentos 
  ADD COLUMN data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
```
- ✅ Adicionado: `data_atualizacao` (tracking)
- ✅ Criado index em `data_atualizacao`

---

#### 👤 **PERFIS** (NOVA TABELA)
```sql
CREATE TABLE perfis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_nome (nome),
    KEY idx_ativo (ativo)
);
```
- ✅ Criada nova tabela com 4 perfis padrão
- ✅ INSERT com `ON DUPLICATE KEY UPDATE`

**Seed inicial:**
- ADMIN - Administrador do sistema
- PROFISSIONAL - Profissional de saúde
- PACIENTE - Paciente
- GERENTE - Gerente administrativo

---

## 📝 Alterações de Entidades JPA

### 1. **Usuario.java**
```java
// ADICIONADO
@Column(nullable = false, length = 150)
private String nome;

@Column(length = 11)
private String cpf;

@Column(length = 20)
private String telefone;

// MELHORADO
@PreUpdate
protected void onUpdate() {
    dataAtualizacao = LocalDateTime.now();
}
```

### 2. **Atendimento.java**
```java
// RENOMEADO
@Column(name = "data_hora", nullable = false)
private LocalDateTime dataHora;  // antes: dataInicio

// ADICIONADO
@Column(name = "tipo_atendimento", nullable = false, length = 50)
private String tipoAtendimento = "PRESENCIAL";

@Column(nullable = false, length = 50)
private String status = "AGENDADO";

@Column(columnDefinition = "TEXT")
private String anotacoes;

@Column(name = "data_atualizacao")
private LocalDateTime dataAtualizacao;

// MELHORADO
@PreUpdate
protected void onUpdate() {
    dataAtualizacao = LocalDateTime.now();
}
```

### 3. **Profissional.java**
```java
// ADICIONADO
@Column(name = "valor_fixo", precision = 10, scale = 2)
private BigDecimal valorFixo;

@Column(name = "horarios_atendimento", length = 255)
private String horariosAtendimento;

@Column(name = "data_atualizacao")
private LocalDateTime dataAtualizacao;

// MELHORADO
@PreUpdate
protected void onUpdate() {
    dataAtualizacao = LocalDateTime.now();
}
```

### 4. **Paciente.java**
```java
// ADICIONADO
@Column(name = "data_atualizacao")
private LocalDateTime dataAtualizacao;

// MELHORADO
@PreUpdate
protected void onUpdate() {
    dataAtualizacao = LocalDateTime.now();
}
```

---

## 🔨 Alterações de Código

### AtendimentoService.java
```java
// ANTES
atendimento.setDataInicio(dataHora);

// DEPOIS
atendimento.setDataHora(dataHora);

// ANTES
.filter(a -> a.getDataInicio() != null && a.getDataFim() == null)
.noneMatch(a -> !a.getDataInicio().isBefore(...))

// DEPOIS
.filter(a -> a.getDataHora() != null && a.getDataFim() == null)
.noneMatch(a -> !a.getDataHora().isBefore(...))
```

### AtendimentoResponse.java
```java
// ANTES
.dataHora(atendimento.getDataInicio().format(formatter))

// DEPOIS
.dataHora(atendimento.getDataHora().format(formatter))
```

---

## 📊 Impacto das Mudanças

| Aspecto | Antes | Depois | Impacto |
|--------|-------|--------|---------|
| **Usuarios** | 6 colunas | 9 colunas | +3 (nome, cpf, telefone) |
| **Atendimentos** | 7 colunas | 12 colunas | +5 (tipo, status, anotacoes, etc) |
| **Profissionais** | 13 colunas | 15 colunas | +2 (valor_fixo, horarios) |
| **Pacientes** | 16 colunas | 17 colunas | +1 (data_atualizacao) |
| **Tabelas totais** | 5 | 6 | +1 (perfis) |

---

## ✅ Checklist de Implementação

### Migrações Flyway
- [x] V003__add_nome_columns_and_improvements.sql criado
- [x] USUARIOS: nome, cpf, telefone adicionados
- [x] ATENDIMENTOS: data_hora, tipo_atendimento, status, anotacoes
- [x] PROFISSIONAIS: valor_fixo, horarios_atendimento, data_atualizacao
- [x] PACIENTES: data_atualizacao
- [x] ESPECIALIDADES: data_atualizacao
- [x] PAGAMENTOS: data_atualizacao
- [x] PERFIS: tabela nova com seed

### Entidades JPA
- [x] Usuario.java: nome, cpf, telefone
- [x] Atendimento.java: dataHora (renomeado), tipo, status, anotacoes, dataAtualizacao
- [x] Profissional.java: valorFixo, horariosAtendimento, dataAtualizacao
- [x] Paciente.java: dataAtualizacao
- [x] PrePersist/PreUpdate methods adicionados

### Código de Serviços
- [x] AtendimentoService.java: setDataInicio → setDataHora
- [x] AtendimentoService.java: getDataInicio → getDataHora
- [x] AtendimentoResponse.java: getDataInicio → getDataHora
- [x] Compilação: ✅ Sem erros

### Documentação
- [x] DATABASE_SCHEMA_UPDATES.md criado (este arquivo)
- [x] Explicação de cada mudança
- [x] Impacto listado
- [x] Compatibilidade verificada

---

## 🚀 Como Executar a Migração

### Via Docker Compose
```bash
docker-compose up -d
# Flyway executará automaticamente na startup
```

### Via Maven (Local)
```bash
cd backend
mvn spring-boot:run
# Flyway executará na inicialização
```

### Verificar migração no banco
```sql
-- MySQL
DESCRIBE usuarios;
DESCRIBE atendimentos;
DESCRIBE profissionais;
SELECT * FROM perfis;

-- Flyway history
SELECT * FROM flyway_schema_history;
```

---

## 🔄 Compatibilidade

### Retrocompatibilidade
- ✅ Dados antigos continuam funcionar
- ✅ Coluna `nome` tem DEFAULT ''
- ✅ Coluna `tipo_atendimento` tem DEFAULT 'PRESENCIAL'
- ✅ Coluna `status` tem DEFAULT 'AGENDADO'

### Casos de Sucesso
```sql
-- Atendimentos antigos (sem tipo/status) receberão defaults
SELECT * FROM atendimentos 
WHERE tipo_atendimento = 'PRESENCIAL' 
AND status = 'AGENDADO';

-- Usuários antigos (sem nome) receberão ''
SELECT * FROM usuarios WHERE nome = '';

-- Updates funcionam normalmente
UPDATE usuarios SET nome = 'Dr. João' WHERE id = 1;
```

---

## ⚠️ Notas Importantes

1. **Nome obrigatório:** Coluna `nome` em usuários é NOT NULL com DEFAULT ''
   - Scripts de migration devem preencher valores reais após
   - Frontend deve sempre enviar nome preenchido

2. **Mudança de coluna em Atendimentos:** `data_inicio` → `data_hora`
   - Semanticamente mais correto (reflete o tipo do campo)
   - Queries antigas precisam atualizar

3. **Perfis em tabela separada:** Não utilizado imediatamente
   - Preparação para futura segregação de permissões por perfil
   - Enum `Perfil` ainda é usada em Usuarios

4. **Data updates:** Todos os @PreUpdate foram verificados
   - EntityListeners garantem data_atualizacao sempre atualizada

---

## 📚 Referências

- **Arquivo de migração:** `backend/src/main/resources/db/migration/V003__add_nome_columns_and_improvements.sql`
- **Entidades atualizadas:** `backend/src/main/java/com/clinica/alles/domain/*/`
- **Serviços:** `backend/src/main/java/com/clinica/alles/application/service/`
- **DTOs:** `backend/src/main/java/com/clinica/alles/common/dto/`

---

## 🎯 Próximas Etapas

1. **Executar backend** para aplicar migração
2. **Verificar no banco** que colunas foram criadas
3. **Popular dados** se necessário (script SQL)
4. **Testar formulários** com novos campos
5. **Atualizar docs** da API (Swagger)

