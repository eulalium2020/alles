# 📁 ESTRUTURA DO PROJETO ALLES

**Atualizado**: 02/07/2026 | **Status**: ✅ Documentação + Backend Completo

---

## 🗂️ VISÃO GERAL COMPLETA

```
/home/wsl/projetos/alles/ (repositório Git)
│
├── 📚 DOCUMENTAÇÃO DE ARQUITETURA
│   ├── README.md ............................. Visão geral do projeto
│   ├── SPEC_INICIAL.md ....................... 22 requisitos aprovados
│   ├── ARQUITETURA.md ........................ Design SOLID + padrões
│   ├── MODELO_DADOS.md ....................... ERD (15 tabelas MySQL)
│   ├── FLUXOGRAMAS.md ........................ 7 processos principais
│   ├── CONVENÇÕES_E_PADRÕES.md .............. Code standards (Java/TS)
│   └── ESTRUTURA_PROJETO.md ................. Este arquivo
│
├── 📚 DOCUMENTAÇÃO DE DESENVOLVIMENTO
│   ├── DESENVOLVIMENTO_BACKEND.md ............ Guia completo backend
│   ├── TESTES_BACKEND.md ..................... Estratégia de testes
│   └── (Frontend + Mobile em breve)
│
├── 🐳 INFRAESTRUTURA
│   ├── docker-compose.yml .................... MySQL 8.x + PhpMyAdmin
│   └── .gitignore ............................ Git versioning config
│
├── 💻 BACKEND (Java/Spring Boot 3.x)
│   └── backend/
│       ├── src/main/java/com/clinica/alles/
│       │   ├── AllesBackendApplication.java (main class)
│       │   │
│       │   ├── common/
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   ├── WebConfig.java
│       │   │   │   └── AuditorAwareConfig.java
│       │   │   │
│       │   │   ├── exception/
│       │   │   │   ├── BusinessException.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   ├── DuplicateResourceException.java
│       │   │   │   ├── UnauthorizedException.java
│       │   │   │   ├── ValidationException.java
│       │   │   │   ├── ErrorResponse.java
│       │   │   │   └── GlobalExceptionHandler.java
│       │   │   │
│       │   │   ├── security/
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── JwtProperties.java
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   └── JwtAuthenticationEntryPoint.java
│       │   │   │
│       │   │   ├── constants/
│       │   │   │   └── ApplicationConstants.java
│       │   │   │
│       │   │   ├── dto/
│       │   │   │   ├── LoginRequestDTO.java (⏳ será usado)
│       │   │   │   ├── LoginResponseDTO.java (⏳ será usado)
│       │   │   │   └── PaginationDTO.java (⏳ será usado)
│       │   │   │
│       │   │   └── util/
│       │   │       └── DateUtil.java (⏳ será usado)
│       │   │
│       │   ├── domain/ (7 Entities)
│       │   │   ├── usuario/
│       │   │   │   ├── Usuario.java
│       │   │   │   └── Perfil.java (enum)
│       │   │   │
│       │   │   ├── especialidade/
│       │   │   │   └── Especialidade.java
│       │   │   │
│       │   │   ├── profissional/
│       │   │   │   ├── Profissional.java
│       │   │   │   └── TipoPagamento.java (enum)
│       │   │   │
│       │   │   ├── paciente/
│       │   │   │   └── Paciente.java
│       │   │   │
│       │   │   ├── planosasaude/
│       │   │   │   └── PlanoSaude.java
│       │   │   │
│       │   │   ├── atendimento/
│       │   │   │   ├── Atendimento.java
│       │   │   │   └── (Prontuario, Prescricao - próxima fase)
│       │   │   │
│       │   │   └── pagamento/
│       │   │       ├── Pagamento.java
│       │   │       └── StatusPagamento.java (enum)
│       │   │
│       │   ├── infrastructure/
│       │   │   ├── persistence/ (7 Repositories)
│       │   │   │   ├── IUsuarioRepository.java
│       │   │   │   ├── IEspecialidadeRepository.java
│       │   │   │   ├── IProfissionalRepository.java
│       │   │   │   ├── IPacienteRepository.java
│       │   │   │   ├── IPlanoSaudeRepository.java
│       │   │   │   ├── IAtendimentoRepository.java
│       │   │   │   └── IPagamentoRepository.java
│       │   │   │
│       │   │   ├── security/ (implementações)
│       │   │   │   └── (referenciadas em common/security)
│       │   │   │
│       │   │   ├── events/ (⏳ próxima fase)
│       │   │   │   └── (Domain Events)
│       │   │   │
│       │   │   └── audit/ (⏳ próxima fase)
│       │   │       └── (Auditoria de acesso)
│       │   │
│       │   ├── application/ (⏳ próxima fase)
│       │   │   ├── profissional/
│       │   │   │   ├── dto/
│       │   │   │   │   ├── CadastrarProfissionalDTO.java
│       │   │   │   │   └── ProfissionalResponseDTO.java
│       │   │   │   └── usecase/
│       │   │   │       └── CadastrarProfissionalUseCase.java
│       │   │   ├── paciente/
│       │   │   ├── atendimento/
│       │   │   ├── pagamento/
│       │   │   └── relatorio/
│       │   │
│       │   └── presentation/ (⏳ próxima fase)
│       │       ├── controller/
│       │       │   ├── AuthController.java
│       │       │   ├── ProfissionalController.java
│       │       │   ├── PacienteController.java
│       │       │   ├── AtendimentoController.java
│       │       │   ├── PagamentoController.java
│       │       │   └── RelatorioController.java
│       │       └── dto/
│       │           └── ApiResponse.java
│       │
│       ├── src/main/resources/
│       │   ├── application.yml
│       │   ├── application-dev.yml (⏳ próxima)
│       │   ├── application-prod.yml (⏳ próxima)
│       │   └── db/
│       │       ├── migration/
│       │       │   ├── V001__initial_schema.sql (⏳ próxima)
│       │       │   └── V002__add_indexes.sql (⏳ próxima)
│       │       └── schema.sql
│       │
│       ├── src/test/java/ (⏳ próxima fase)
│       │   ├── domain/
│       │   ├── application/
│       │   ├── presentation/
│       │   ├── fixture/
│       │   └── config/
│       │
│       ├── pom.xml (dependências Maven)
│       ├── Dockerfile (⏳ próxima)
│       └── target/ (JAR compilado)
│
├── 💻 FRONTEND (React/TypeScript)
│   └── frontend/ (⏳ próxima fase)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── hooks/
│       │   ├── context/
│       │   ├── types/
│       │   ├── styles/
│       │   └── utils/
│       ├── public/
│       ├── package.json
│       └── tsconfig.json
│
├── 📱 MOBILE (React Native/TypeScript)
│   └── mobile/ (⏳ próxima fase)
│       ├── src/
│       ├── package.json
│       └── app.json
│
└── 📊 GIT REPOSITORY
    └── .git/
        └── commits: 2 (documentação + backend)
```

---

## 📈 STATUS POR FASE

### ✅ FASE 1: ESPECIFICAÇÃO (02/07/2026)
- ✅ SPEC_INICIAL.md (22 requisitos)
- ✅ ARQUITETURA.md (design SOLID)
- ✅ MODELO_DADOS.md (ERD 15 tabelas)
- ✅ FLUXOGRAMAS.md (7 processos)
- ✅ CONVENÇÕES_E_PADRÕES.md (code standards)
- ✅ README.md (visão geral)

### ✅ FASE 2: BACKEND SETUP (02/07/2026)
- ✅ Maven project structure (80 arquivos)
- ✅ pom.xml (20+ dependências)
- ✅ application.yml (configurado)
- ✅ AllesBackendApplication.java
- ✅ docker-compose.yml
- ✅ .gitignore

### ✅ FASE 3: ENTITIES (02/07/2026)
- ✅ Usuario + Perfil enum
- ✅ Especialidade
- ✅ Profissional + TipoPagamento enum
- ✅ Paciente
- ✅ PlanoSaude
- ✅ Atendimento
- ✅ Pagamento + StatusPagamento enum

### ✅ FASE 4: AUTENTICAÇÃO (02/07/2026)
- ✅ JwtTokenProvider
- ✅ JwtAuthenticationFilter
- ✅ CustomUserDetailsService
- ✅ SecurityConfig
- ✅ JwtAuthenticationEntryPoint
- ✅ GlobalExceptionHandler
- ✅ 5 Custom Exceptions

### ✅ FASE 4B: REPOSITORIES (02/07/2026)
- ✅ IUsuarioRepository
- ✅ IEspecialidadeRepository
- ✅ IProfissionalRepository
- ✅ IPacienteRepository
- ✅ IPlanoSaudeRepository
- ✅ IAtendimentoRepository
- ✅ IPagamentoRepository

### ⏳ FASE 5: DATABASE SCHEMA (próxima)
- ⏳ Flyway migrations
- ⏳ V001__initial_schema.sql (15 tabelas)
- ⏳ Índices e constraints
- ⏳ Testes de schema

### ⏳ FASE 6: SERVICES (seguinte)
- ⏳ ProfissionalService
- ⏳ PacienteService
- ⏳ AgendamentoService
- ⏳ PagamentoService (Strategy Pattern)
- ⏳ RelatorioService
- ⏳ AutenticacaoService
- ⏳ Testes unitários (80%+ cobertura)

### ⏳ FASE 7: CONTROLLERS (seguinte)
- ⏳ AuthController (/api/auth/login)
- ⏳ ProfissionalController (CRUD)
- ⏳ PacienteController (CRUD)
- ⏳ AtendimentoController (agendar, registrar)
- ⏳ PagamentoController
- ⏳ RelatorioController
- ⏳ Integration tests

### ⏳ FASE 8: FRONTEND (seguinte)
- ⏳ Setup React + TypeScript
- ⏳ Componentes base
- ⏳ Páginas de CRUD
- ⏳ Integração com API
- ⏳ Testes React

### ⏳ FASE 9: MOBILE (seguinte)
- ⏳ Setup React Native
- ⏳ Componentes base
- ⏳ Integração com API
- ⏳ Build APK/IPA

---

## 📊 COMMITS GIT

```
7a53948 - feat: implement backend structure with Spring Boot 3.x
556026d - docs: add complete system specification and architecture
```

---

## 📈 ESTATÍSTICAS

| Aspecto | Quantidade |
|---------|-----------|
| Arquivos de Documentação | 8 |
| Linhas de Documentação | 13,000+ |
| Arquivos Java (Backend) | 80 |
| Entities | 7 |
| Repositories | 7 |
| Enums | 3 |
| Custom Exceptions | 5 |
| Security Components | 5 |
| Dependências Maven | 20+ |
| Linhas de Código Java | ~8,000 |

---

## 🔄 FLUXO DE DESENVOLVIMENTO

```
Documentação ✅
    ↓
Backend Setup ✅
    ↓
Entities ✅
    ↓
Autenticação ✅
    ↓
Database Schema ⏳
    ↓
Services ⏳
    ↓
Controllers ⏳
    ↓
Frontend ⏳
    ↓
Mobile ⏳
    ↓
Testes Completos ⏳
    ↓
Deployment ⏳
    ↓
Go-Live 🎯 (27/08/2026)
```

---

## 🚀 COMO USAR

### 1. Clonar Repositório
```bash
cd /home/wsl/projetos/alles
git log --oneline  # Ver commits
```

### 2. Ler Documentação
```bash
# Arquitetura
cat README.md
cat ARQUITETURA.md
cat MODELO_DADOS.md

# Desenvolvimento
cat DESENVOLVIMENTO_BACKEND.md
cat TESTES_BACKEND.md
```

### 3. Setup Backend
```bash
# Iniciar MySQL
docker-compose up -d mysql

# Compilar
cd backend && mvn clean install

# Rodar
mvn spring-boot:run
```

### 4. Acessar
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/swagger-ui.html
- PhpMyAdmin: http://localhost:8081

---

## 🎯 PRÓXIMAS AÇÕES

1. Criar migrations Flyway (V001__initial_schema.sql)
2. Implementar Services
3. Criar Controllers REST
4. Implementar Frontend React
5. Setup Mobile React Native

---

**Atualizado**: 02/07/2026 | **Commit**: 7a53948
