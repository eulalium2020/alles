# 📊 STATUS DO PROJETO ALLES

**Atualizado em:** 12/07/2026  
**Versão de referência:** v1.0.x

---

## Resumo executivo

O projeto possui backend, frontend web e canal mobile funcionais, com autenticação JWT, CRUD dos módulos principais, migrações Flyway, expansão de testes e pipeline de deploy.

**Progresso geral estimado:** **15/15 fases principais concluídas** (100%).

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
| 13 | Estratégia e expansão de testes | ✅ Concluída |
| 14 | Canal mobile (React Native) | ✅ Concluída |
| 15 | Deploy e CI/CD de produção | ✅ Concluída |

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
- Cobertura de integração expandida para controllers de Paciente e Atendimento

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
- Suíte E2E base com Cypress (`frontend/cypress`)
- Pipeline CI validando lint/type-check/test/build

---

## Mobile - status atual

### Entregue
- Projeto React Native com Expo (`mobile/`)
- Autenticação JWT com persistência de sessão (AsyncStorage)
- Dashboard mobile com consumo da API de profissionais
- Hooks e serviços de API estruturados para reutilização no canal mobile

---

## Entregas de infraestrutura e deploy

1. Dockerfile backend (`backend/Dockerfile`).
2. Dockerfile frontend + Nginx (`frontend/Dockerfile`, `frontend/nginx.conf`).
3. Orquestração de produção (`docker-compose.prod.yml`).
4. CI (`.github/workflows/ci.yml`).
5. Deploy de imagens para GHCR (`.github/workflows/deploy.yml`).
6. Parametrização de runtime por ambiente (`application.yml` + `.env.prod.example`).

---

## Referências

- [`README.md`](./README.md)
- [`INTEGRACAO_FRONTEND_BACKEND.md`](./INTEGRACAO_FRONTEND_BACKEND.md)
- [`DESENVOLVIMENTO_BACKEND.md`](./DESENVOLVIMENTO_BACKEND.md)
- [`frontend/DESENVOLVIMENTO_FRONTEND.md`](./frontend/DESENVOLVIMENTO_FRONTEND.md)
