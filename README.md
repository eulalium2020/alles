# 🏥 ALLES - Sistema de Gestão de Clínica

Sistema completo de gestão para clínicas com múltiplas especialidades, controle de acesso, registro de atendimentos e faturamento de profissionais.

**Status**: 📋 Documentação Concluída | ⏳ Desenvolvimento em Breve

---

## 🎯 Visão Geral

### Objetivo
Fornecer uma plataforma integrada para:
- 📅 **Agendamento** de consultas e atendimentos
- 👥 **Gestão** de profissionais, pacientes e planos de saúde
- 💰 **Cálculo automático** de pagamentos por profissional
- 📊 **Relatórios** mensais de atendimentos e receita
- 🔐 **Controle de acesso** baseado em perfis (RBAC)

### Stack Tecnológico
- **Backend**: Java 17 + Spring Boot 3.x
- **Frontend Web**: React 18.x + TypeScript
- **Mobile**: React Native + TypeScript
- **Database**: MySQL 8.x
- **Autenticação**: JWT + BCrypt

---

## 📁 ESTRUTURA DE DOCUMENTAÇÃO

### Documentação Arquitetural
| Documento | Descrição |
|-----------|-----------|
| [`SPEC_INICIAL.md`](./SPEC_INICIAL.md) | Especificação com respostas dos requisitos |
| [`ARQUITETURA.md`](./ARQUITETURA.md) | Arquitetura técnica (SOLID, camadas, padrões) |
| [`MODELO_DADOS.md`](./MODELO_DADOS.md) | ERD, tabelas MySQL e relacionamentos |
| [`FLUXOGRAMAS.md`](./FLUXOGRAMAS.md) | Fluxogramas de processos do sistema |
| [`CONVENÇÕES_E_PADRÕES.md`](./CONVENÇÕES_E_PADRÕES.md) | Padrões de código, nomenclatura e testes |

### Estrutura de Pastas
```
alles/
├── backend/                    # API Java/Spring Boot
│   ├── src/main/java/.../
│   ├── src/test/
│   ├── pom.xml
│   └── docker-compose.yml
│
├── frontend/                   # SPA React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                     # App React Native
│   ├── src/
│   ├── package.json
│   └── app.json
│
├── docs/                       # Documentação
│   ├── ARQUITETURA.md
│   ├── MODELO_DADOS.md
│   ├── FLUXOGRAMAS.md
│   └── ...
│
└── README.md                   # Este arquivo
```

---

## 🚀 COMEÇANDO

### Pré-requisitos
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Docker (opcional)

### Setup de Desenvolvimento

#### 1. Clonar repositório
```bash
cd /home/wsl/projetos/alles
git init
git config user.email "developer@alles.com"
git config user.name "ALLES Developer"
```

#### 2. Inicializar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080/api`

#### 3. Inicializar Frontend
```bash
cd ../frontend
npm install
npm start
```

A aplicação web estará disponível em: `http://localhost:3000`

#### 4. Banco de Dados
```bash
cd docker
docker-compose up -d mysql
```

MySQL estará em: `localhost:3306`

---

## 📊 FLUXOS PRINCIPAIS

### 1. Agendamento de Consulta
```
Paciente → Busca Especialidade → Seleciona Profissional → Escolhe Data/Hora → Confirma
                                                           ↓
                                                   Validação de Disponibilidade
                                                           ↓
                                                    Cálculo de Valor
                                                           ↓
                                                   Atendimento Agendado ✅
```

### 2. Realização e Registro de Atendimento
```
Profissional → Lista Atendimentos do Dia → Clica em Atendimento → Preenche Prontuário
                                                                   Adiciona Prescrições
                                                                         ↓
                                                              Salva Atendimento
                                                                         ↓
                                                         Gera Pagamento (async)
```

### 3. Cálculo de Pagamento Mensal
```
Job Agendado (1º dia útil) → Busca Atendimentos Realizados → Agrupa por Profissional
                                                                    ↓
                                           Calcula Valor (Strategy Pattern)
                                                                    ↓
                                           Aplica Desconto Clínica
                                                                    ↓
                                           Cria Pagamento PENDENTE
                                                                    ↓
                                     Admin Aprova → Processa → Pago ✅
```

### 4. Relatório Mensal
```
Profissional/Admin → Acessa Relatórios → Seleciona Período → Visualiza
                                                    ↓
                        [Exportar PDF] [Exportar Excel] [Imprimir]
```

---

## 🏛️ PRINCÍPIOS ARQUITETURAIS

### SOLID
- **S**ingle Responsibility: Cada classe tem uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Subtipos são intercambiáveis
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependências invertidas

### Design Patterns
- **Strategy Pattern**: Cálculo de pagamentos (variações)
- **Repository Pattern**: Acesso a dados
- **Dependency Injection**: Spring gerencia dependências
- **Domain Events**: Comunicação entre aggregates
- **DTO Pattern**: Transferência de dados segura

### Camadas
```
Presentation (Controllers)
         ↓
Application (Use Cases)
         ↓
Domain (Entities, Business Rules)
         ↓
Infrastructure (Repositories, Security)
```

---

## 🔐 SEGURANÇA

### Autenticação
- JWT Token com expiração
- Refresh Token para renovação
- BCrypt para hash de senhas

### Autorização
- RBAC (Role-Based Access Control)
- 4 perfis: Admin, Profissional, Paciente, Recepcionista
- Validação de acesso em cada endpoint

### Dados Sensíveis
- ✅ Criptografia em rest + transport
- ✅ Senhas com BCrypt
- ✅ CPF/Dados bancários protegidos
- ✅ Auditoria de acesso
- ✅ Soft delete (dados nunca deletados)

### LGPD
- ✅ Consentimento de pacientes
- ✅ Dados criptografados
- ✅ Acesso auditado
- ✅ Backup automático

---

## 📈 PERFIS DE USUÁRIO

### 👨‍💼 Admin
- Acesso total ao sistema
- Gerencia profissionais, pacientes, planos
- Aprova pagamentos
- Visualiza todos os relatórios

### 👨‍⚕️ Profissional
- Visualiza seus agendamentos
- Registra atendimentos e prontuários
- Visualiza seus pagamentos
- Exporta relatório pessoal

### 👤 Paciente
- Agenda consultas
- Visualiza histórico de atendimentos
- Consulta dados de plano de saúde
- Recebe notificações

### 💼 Recepcionista
- Gerencia agendamentos
- Registra chegada de pacientes
- Suporta admin

---

## 🗄️ MODELOS DE DADOS PRINCIPAIS

### Usuário
```
Usuario
├── email (UNIQUE)
├── senha (hashed)
├── perfil (FK)
└── ativo
```

### Profissional
```
Profissional
├── usuario_id (FK, 1:1)
├── especialidade_id (FK)
├── crm (UNIQUE)
├── crefito (UNIQUE)
├── dados_bancarios
├── tipo_pagamento (FIXO / PERCENTUAL / AMBOS)
└── horarios_atendimento (1:N)
```

### Paciente
```
Paciente
├── usuario_id (FK, 1:1)
├── cpf (UNIQUE)
├── data_nascimento
├── telefone, endereco
├── alergias
├── antecedentes_medicos
└── planos_saude (N:M)
```

### Atendimento
```
Atendimento
├── profissional_id (FK)
├── paciente_id (FK)
├── especialidade_id (FK)
├── plano_saude_id (FK, opcional)
├── data_agendamento
├── status (AGENDADO / REALIZADO / CANCELADO / NAO_COMPARECEU)
├── tipo (PRESENCIAL / TELEMEDICINA)
├── prontuario (1:1)
├── prescricoes (1:N)
└── pagamento (1:N)
```

### Pagamento
```
Pagamento
├── profissional_id (FK)
├── mes_referencia
├── valor_bruto
├── desconto_clinica
├── valor_liquido
├── status (PENDENTE / PROCESSANDO / PAGO / FALHOU)
└── detalhes (1:N)
```

---

## 🧪 TESTES

### Cobertura
- ✅ Testes unitários: > 80%
- ✅ Testes de integração: Camada de dados
- ✅ Testes de API: Endpoints críticos
- ✅ Testes E2E: Fluxos principais

### Executar Testes
```bash
# Backend
cd backend
mvn test                          # Unitários
mvn verify                        # Integração

# Frontend
cd frontend
npm test                          # Jest + React Testing Library
npm run test:e2e                  # Cypress
```

---

## 📋 CHECKLIST DE DESENVOLVIMENTO

- [ ] Backend - Setup inicial + estrutura
- [ ] Backend - Entities e Repositories
- [ ] Backend - Authentication & Authorization
- [ ] Backend - CRUD de Profissionais
- [ ] Backend - CRUD de Pacientes
- [ ] Backend - CRUD de Planos de Saúde
- [ ] Backend - Agendamento de Atendimentos
- [ ] Backend - Cálculo de Pagamentos
- [ ] Backend - Geração de Relatórios
- [ ] Backend - Testes completos
- [ ] Frontend - Setup inicial
- [ ] Frontend - Layout e componentes base
- [ ] Frontend - Autenticação
- [ ] Frontend - Dashboard
- [ ] Frontend - Páginas de CRUD
- [ ] Frontend - Agendamento
- [ ] Frontend - Relatórios
- [ ] Frontend - Testes
- [ ] Mobile - Setup React Native
- [ ] Mobile - Componentes base
- [ ] Mobile - Autenticação
- [ ] Mobile - Funcionalidades core
- [ ] Deploy - Docker backend
- [ ] Deploy - Deploy em produção

---

## 🛠️ FERRAMENTAS E DEPENDÊNCIAS

### Backend
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- MySQL Connector
- JUnit 5
- Mockito
- Lombok
- Swagger/Springdoc

### Frontend
- React 18.x
- TypeScript 5.x
- Axios (HTTP client)
- React Router (navegação)
- Zustand (state management)
- TailwindCSS (estilos)
- React Testing Library
- Cypress (E2E)

### DevOps
- Docker
- Docker Compose
- Git
- GitHub Actions (CI/CD)

---

## 📞 SUPORTE E CONTRIBUIÇÃO

### Issues
Ao abrir issue, incluir:
- Título claro e descritivo
- Descrição do problema
- Passos para reproduzir
- Resultado esperado vs actual
- Screenshots (se aplicável)

### Pull Requests
1. Criar branch: `git checkout -b feature/sua-feature`
2. Commit com mensagem clara
3. Push: `git push origin feature/sua-feature`
4. Abrir PR com descrição
5. Passar em code review

### Commits
```
feat: adicionar nova feature
fix: corrigir bug
refactor: refatorar código
test: adicionar testes
docs: atualizar documentação
chore: manutenção
```

---

## 📄 LICENSE

Este projeto é proprietário. Todos os direitos reservados.

---

## 📞 CONTATO

- **Email**: dev@alles.com
- **Issues**: GitHub Issues
- **Docs**: Consulte a pasta `/docs`

---

## 🎉 Últimas Atualizações

**02/07/2026** - Documentação arquitetural completa
- ✅ SPEC com requisitos aprovados
- ✅ Arquitetura SOLID definida
- ✅ Modelo de dados (ERD)
- ✅ Fluxogramas de processos
- ✅ Convenções e padrões

**Próximo**: Iniciar desenvolvimento do backend

---

**Versão**: 1.0  
**Status**: 📋 Documentação | ⏳ Em Breve: Desenvolvimento
