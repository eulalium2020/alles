# 🏗️ ARQUITETURA - Sistema de Gestão de Clínica

**Status**: ✅ Aprovado  
**Data**: 02/07/2026  
**Stack**: Java/Spring Boot + React + MySQL + React Native

---

## 📊 RESUMO EXECUTIVO

| Aspecto | Definição |
|---------|-----------|
| **Backend** | Java 17 + Spring Boot 3.x + Spring Security |
| **Frontend** | React 18.x + TypeScript + Axios |
| **Mobile** | React Native + TypeScript |
| **Database** | MySQL 8.x |
| **Auth** | JWT com Role-Based Access Control (RBAC) |
| **Arquitetura** | Layered + SOLID Principles |
| **API** | RESTful com Hateoas |

---

## 🏛️ ARQUITETURA DE SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (WEB)                         │
│              React SPA + TypeScript                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│              API GATEWAY / SECURITY                      │
│         (Spring Security + CORS + Validation)           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│          BACKEND (Spring Boot)                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Controllers (Presentation Layer)                 │  │
│  │ - ProfissionalController                        │  │
│  │ - PacienteController                            │  │
│  │ - AtendimentoController                         │  │
│  │ - PagamentoController                           │  │
│  │ - RelatorioController                           │  │
│  └──────────────────────────────────────────────────┘  │
│                     │                                   │
│  ┌──────────────────▼──────────────────────────────┐  │
│  │ Services (Business Logic Layer)                 │  │
│  │ - ProfissionalService                          │  │
│  │ - PacienteService                              │  │
│  │ - AgendamentoService                           │  │
│  │ - PagamentoService (Strategy Pattern)          │  │
│  │ - RelatorioService                             │  │
│  │ - AutenticacaoService                          │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│  ┌──────────────────▼──────────────────────────────┐  │
│  │ Repositories (Data Access Layer)                │  │
│  │ - ProfissionalRepository                       │  │
│  │ - PacienteRepository                           │  │
│  │ - AtendimentoRepository                        │  │
│  │ - PlanoSaudeRepository                         │  │
│  │ - PagamentoRepository                          │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│  ┌──────────────────▼──────────────────────────────┐  │
│  │ Domain (Entities + Value Objects)              │  │
│  │ - Profissional (aggregate root)                │  │
│  │ - Paciente (aggregate root)                    │  │
│  │ - Atendimento (aggregate root)                 │  │
│  │ - Pagamento (aggregate root)                   │  │
│  │ - PlanoSaude (aggregate root)                  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│            BANCO DE DADOS (MySQL)                       │
│  profissional, paciente, plano_saude, atendimento       │
│  pagamento, usuario, auditoria, especialidade           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              CLIENTE (MOBILE)                           │
│         React Native + TypeScript                       │
│        (mesmo backend/API do web)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUTURA DE PASTAS

### Backend (Java/Spring)

```
alles-backend/
├── src/main/java/com/clinica/alles/
│   ├── common/
│   │   ├── config/          # Configurações (Security, DB, etc)
│   │   ├── exception/       # Exceções customizadas
│   │   ├── dto/             # DTOs (data transfer objects)
│   │   ├── util/            # Utilidades gerais
│   │   └── constants/       # Constantes
│   │
│   ├── domain/              # Entities + Business Rules
│   │   ├── usuario/
│   │   │   ├── entity/Usuario.java
│   │   │   ├── enums/Perfil.java
│   │   │   └── value/Email.java
│   │   ├── profissional/
│   │   │   ├── entity/Profissional.java
│   │   │   ├── repository/IProfissionalRepository.java
│   │   │   ├── value/CRM.java
│   │   │   └── service/ProfissionalDomainService.java
│   │   ├── paciente/
│   │   │   ├── entity/Paciente.java
│   │   │   ├── repository/IPacienteRepository.java
│   │   │   └── value/CPF.java
│   │   ├── especialidade/
│   │   │   └── entity/Especialidade.java
│   │   ├── planosasaude/
│   │   │   ├── entity/PlanoSaude.java
│   │   │   ├── repository/IPlanoSaudeRepository.java
│   │   │   └── value/CoberturaProcedimento.java
│   │   ├── atendimento/
│   │   │   ├── entity/Atendimento.java
│   │   │   ├── repository/IAtendimentoRepository.java
│   │   │   ├── enums/TipoAtendimento.java
│   │   │   ├── event/AtendimentoRegistradoEvent.java
│   │   │   └── service/AtendimentoDomainService.java
│   │   └── pagamento/
│   │       ├── entity/Pagamento.java
│   │       ├── repository/IPagamentoRepository.java
│   │       ├── strategy/CalculoPagamentoStrategy.java
│   │       └── event/PagamentoGeradoEvent.java
│   │
│   ├── application/         # Use Cases e Orquestração
│   │   ├── profissional/
│   │   │   ├── dto/CadastrarProfissionalDTO.java
│   │   │   ├── usecase/CadastrarProfissionalUseCase.java
│   │   │   └── usecase/ListarProfissionaisUseCase.java
│   │   ├── paciente/
│   │   ├── atendimento/
│   │   │   ├── dto/RegistrarAtendimentoDTO.java
│   │   │   └── usecase/RegistrarAtendimentoUseCase.java
│   │   ├── pagamento/
│   │   │   ├── usecase/GerarRelatorioPagamentoUseCase.java
│   │   │   └── usecase/CalcularPagamentoProfissionalUseCase.java
│   │   └── relatorio/
│   │       ├── dto/RelatorioPagamentoMensalDTO.java
│   │       └── usecase/GerarRelatorioPagamentoMensalUseCase.java
│   │
│   ├── infrastructure/      # Implementações técnicas
│   │   ├── persistence/     # JPA Repositories
│   │   │   ├── jpa/ProfissionalJpaRepository.java
│   │   │   └── impl/ProfissionalRepositoryImpl.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── SecurityConfig.java
│   │   ├── events/
│   │   │   └── DomainEventPublisher.java
│   │   ├── mail/            # Notificações (futuro)
│   │   ├── audit/           # Auditoria de acesso
│   │   └── cache/           # Cache (futuro)
│   │
│   └── presentation/        # REST Controllers
│       ├── profissional/ProfissionalController.java
│       ├── paciente/PacienteController.java
│       ├── atendimento/AtendimentoController.java
│       ├── pagamento/PagamentoController.java
│       └── relatorio/RelatorioController.java
│
├── src/main/resources/
│   ├── application.yml      # Configurações
│   ├── db/
│   │   ├── migration/       # Flyway/Liquibase migrations
│   │   └── schema.sql
│   └── i18n/                # Internacionalização
│
├── src/test/
│   ├── unit/                # Testes unitários
│   ├── integration/         # Testes de integração
│   └── e2e/                 # Testes end-to-end
│
├── pom.xml
├── docker-compose.yml       # Docker para development
└── README.md
```

### Frontend (React)

```
alles-frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizáveis
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── profissional/    # Componentes de Profissional
│   │   ├── paciente/
│   │   ├── atendimento/
│   │   ├── pagamento/
│   │   └── relatorio/
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Profissionais.tsx
│   │   ├── Pacientes.tsx
│   │   ├── Agendamentos.tsx
│   │   ├── Pagamentos.tsx
│   │   └── Relatorios.tsx
│   │
│   ├── services/            # API clients
│   │   ├── api.ts           # Axios instance
│   │   ├── profissionalService.ts
│   │   ├── pacienteService.ts
│   │   ├── atendimentoService.ts
│   │   ├── pagamentoService.ts
│   │   └── relatorioService.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useFormValidation.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── colors.css
│   │   └── components/
│   │
│   ├── types/               # TypeScript types
│   │   ├── profissional.ts
│   │   ├── paciente.ts
│   │   ├── atendimento.ts
│   │   └── pagamento.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── date-helpers.ts
│   │
│   └── App.tsx
│
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 PRINCÍPIOS SOLID

### S - Single Responsibility Principle
- **ProfissionalService**: Apenas lógica de profissional
- **PagamentoService**: Apenas lógica de pagamento
- **AtendimentoService**: Apenas lógica de atendimento

### O - Open/Closed Principle
- **CalculoPagamentoStrategy**: Aberto para extensão (novos tipos de cálculo)
- Usar interfaces para permitir múltiplas implementações

### L - Liskov Substitution Principle
- Todas as implementações de `CalculoPagamentoStrategy` são substituíveis
- Controllers trabalham com abstrações (interfaces)

### I - Interface Segregation Principle
- `IProfissionalRepository`: Apenas métodos para Profissional
- `IAtendimentoRepository`: Apenas métodos para Atendimento

### D - Dependency Injection Principle
- Spring gerencia todas as dependências
- Usar `@Autowired` ou constructor injection

---

## 🔐 AUTENTICAÇÃO E AUTORIZAÇÃO

### Flow JWT
```
1. Usuário faz login (POST /api/auth/login)
2. Backend valida credenciais
3. Backend gera JWT token + refresh token
4. Cliente armazena tokens
5. Cliente envia JWT em Authorization header
6. Backend valida JWT a cada request
```

### Perfis (RBAC)
- **ADMIN**: Acesso total
- **PROFISSIONAL**: Consulta própios atendimentos/pagamentos
- **PACIENTE**: Consulta próprias consultas
- **RECEPCIONISTA**: Gerencia agendamentos

### Proteção de endpoints
```java
@GetMapping("/atendimentos/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'PROFISSIONAL', 'PACIENTE')")
public ResponseEntity<AtendimentoDTO> getAtendimento(@PathVariable Long id) {
    // Verificar se usuário tem acesso a este atendimento
}
```

---

## 💰 MODELOS DE PAGAMENTO (Strategy Pattern)

```java
interface CalculoPagamentoStrategy {
    BigDecimal calcular(Atendimento atendimento, Profissional profissional);
}

// Implementação 1: Valor fixo por consulta
class CalculoPorConsultaFixa implements CalculoPagamentoStrategy {
    // Busca valor fixo configurado para profissional/especialidade
    // Atendimento particular: valor fixo
    // Atendimento com plano: valor fixo (menor)
}

// Implementação 2: Percentual da receita
class CalculoPorPercentual implements CalculoPagamentoStrategy {
    // Calcula percentual baseado em receita gerada
}

// Factory
class CalculoPagamentoFactory {
    static CalculoPagamentoStrategy criar(TipoPagamento tipo) {
        switch(tipo) {
            case FIXO: return new CalculoPorConsultaFixa();
            case PERCENTUAL: return new CalculoPorPercentual();
        }
    }
}
```

---

## 📊 DOMAIN EVENTS

Eventos de domínio para manter serviços sincronizados:

1. **AtendimentoRegistradoEvent** → Dispara quando atendimento é registrado
   - Pode gerar pagamento automaticamente
   - Pode enviar notificação ao paciente

2. **PagamentoGeradoEvent** → Dispara quando pagamento é calculado
   - Registra em auditoria
   - Pode enviar notificação ao profissional

---

## 🛡️ SEGURANÇA E LGPD

- ✅ Criptografia de dados sensíveis (BCrypt para senhas)
- ✅ Auditoria de acesso (quem acessou o quê e quando)
- ✅ Soft delete (dados nunca são deletados, apenas marcados)
- ✅ Backup automático (MySQL replication/snapshots)
- ✅ CORS configurado
- ✅ Rate limiting (futuro)
- ✅ Validação de entrada em todos os endpoints

---

## 🚀 DEPLOYMENT

### Desenvolvimento
```bash
docker-compose up  # Inicia MySQL + Backend
npm start          # Inicia Frontend
```

### Produção
- Backend: Java Spring Boot em container Docker
- Frontend: Build React e deploy em Nginx/CDN
- Database: MySQL gerenciado (AWS RDS, Google Cloud SQL, etc)
- Mobile: Distribuído via App Store/Play Store

---

## 📱 PREPARAÇÃO PARA REACT NATIVE

- Backend: APIs RESTful agnósticas (já contemplado)
- DTOs: Padrão JSON (já contemplado)
- Autenticação: JWT (funciona igual em mobile)
- Estrutura de pastas React Native: Mirror do React web

---

## ✅ CONVENÇÕES DE CÓDIGO

### Naming
- **Pacotes**: `com.clinica.alles.domain.profissional`
- **Classes**: PascalCase (`ProfissionalService`)
- **Métodos**: camelCase (`buscarProfissionalPorId`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Estrutura de método
1. Validações de entrada
2. Lógica de negócio
3. Persistência
4. Publicar eventos
5. Retornar resultado

### DTOs
- Um DTO para criar (Input)
- Um DTO para retornar (Output)
- Usar `@Validated` para validação

---

## 📚 PRÓXIMAS ETAPAS

1. ✅ Arquitetura definida
2. ⏳ ERD - Criar diagrama de entidades
3. ⏳ Fluxogramas - Documentar fluxos principais
4. ⏳ Setup inicial - Criar projetos base
5. ⏳ Core domain - Implementar entities

