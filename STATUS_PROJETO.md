# 📊 STATUS DO PROJETO ALLES

**Atualizado em:** 08/07/2026  
**Versão de referência:** v1.0.x

---

## Resumo executivo

O projeto já possui backend e frontend web funcionais e integráveis, com autenticação JWT, CRUD dos módulos principais e migrações de banco versionadas com Flyway.

**Progresso geral estimado:** **12/15 fases principais concluídas** (80%).

---

## Situação por fase

| Fase | Tema | Status |
|---|---|---|
| 1 | Setup backend base | ✅ Concluída |
| 2 | Entidades e repositórios | ✅ Concluída |
| 3 | Segurança e autenticação | ✅ Concluída |
| 4 | Estrutura frontend base | ✅ Concluída |
| 5 | Login e rotas protegidas | ✅ Concluída |
| 6 | Integração frontend/backend inicial | ✅ Concluída |
| 7 | Documentação arquitetural | ✅ Concluída |
| 8 | Preparação para CRUD | ✅ Concluída |
| 9 | CRUD frontend (profissional/paciente/atendimento) | ✅ Concluída |
| 10 | Serviços backend | ✅ Concluída |
| 11 | Controllers REST | ✅ Concluída |
| 12 | Migrações de banco (Flyway) | ✅ Concluída |
| 13 | Estratégia e expansão de testes | 🟡 Em evolução |
| 14 | Canal mobile (React Native) | ⏳ Pendente |
| 15 | Deploy e CI/CD de produção | ⏳ Pendente |

---

## Backend - status atual

### Entregue
- API Spring Boot (Java 17) com Spring Security + JWT
- Controllers REST:
  - Auth
  - Profissional
  - Paciente
  - PlanoSaude
  - Atendimento
  - Pagamento
  - Relatorio
- Serviços de negócio para os domínios centrais
- Repositórios JPA por domínio
- Tratamento global de exceções
- Documentação OpenAPI/Swagger
- Migrações Flyway:
  - `V001__initial_schema.sql`
  - `V002__seed_data.sql`

### Qualidade
- Build Maven executa com sucesso
- Suite de testes backend ativa (`src/test`)

---

## Frontend Web - status atual

### Entregue
- React 18 + TypeScript + Vite
- Autenticação e rotas protegidas
- Estado global com Zustand
- Camada de serviços HTTP com token JWT
- Páginas implementadas:
  - Login
  - Dashboard
  - Profissionais
  - Pacientes
  - Atendimentos
  - Planos de Saúde

### Qualidade
- Testes unitários em serviços/hooks/componentes (Vitest)
- Evolução ativa com mudanças locais em andamento no repositório

---

## Pontos pendentes prioritários

1. Consolidar e ampliar cobertura de testes frontend e integração E2E.
2. Implementar canal mobile (React Native).
3. Definir e automatizar pipeline de deploy (CI/CD + ambiente produção).

---

## Referências

- [`README.md`](./README.md)
- [`INTEGRACAO_FRONTEND_BACKEND.md`](./INTEGRACAO_FRONTEND_BACKEND.md)
- [`DESENVOLVIMENTO_BACKEND.md`](./DESENVOLVIMENTO_BACKEND.md)
- [`DESENVOLVIMENTO_FRONTEND.md`](./DESENVOLVIMENTO_FRONTEND.md)
