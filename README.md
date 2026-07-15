# 🏥 ALLES - Sistema de Gestão de Clínica

Sistema de gestão para clínicas com backend em Spring Boot, frontend em React/TypeScript e app mobile em React Native (Expo).

**Status atual (12/07/2026):** **15/15 fases concluídas** com testes expandidos, canal mobile e deploy/CI-CD.  
Consulte o detalhamento em [`STATUS_PROJETO.md`](./STATUS_PROJETO.md).

---

## ✅ Entregas atuais

### Backend (Spring Boot)
- Autenticação e autorização com JWT + Spring Security
- Camadas de domínio, serviços, repositórios e controllers REST
- Módulos de Profissionais, Pacientes, Planos de Saúde, Atendimentos, Pagamentos e Relatórios
- Migrações Flyway (`V001__initial_schema.sql` e `V002__seed_data.sql`)
- Testes unitários e de integração no módulo backend

### Frontend Web (React + TypeScript)
- Login e dashboard com rotas protegidas
- Páginas de gestão: Profissionais, Pacientes, Atendimentos e Planos de Saúde
- Serviços HTTP com interceptação de token JWT
- Hooks e estado global com Zustand
- Testes unitários (Vitest) e E2E (Cypress)

### Mobile (React Native + Expo)
- App em `mobile/` com autenticação JWT
- Sessão persistida com AsyncStorage
- Dashboard mobile com listagem de profissionais via API

### Deploy e CI/CD
- Dockerfiles de produção (`backend/` e `frontend/`)
- `docker-compose.prod.yml` para ambiente de produção
- Workflows GitHub Actions:
  - `ci.yml` (build/test backend, frontend e mobile)
  - `deploy.yml` (build/push de imagens em GHCR)

---

## 🚀 Como executar localmente

### Pré-requisitos
- Java 17+
- Maven 3.8+
- Node.js 18+
- Docker e Docker Compose

### 1. Subir infraestrutura de banco
```bash
cd /home/wsl/projetos/alles
docker compose up -d
```

### 2. Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/api/swagger-ui.html`

### 3. Frontend web
```bash
cd frontend
npm install
npm run dev
```

- Web app: `http://localhost:3000`

### 4. Mobile (Expo)
```bash
cd mobile
npm install
npm run start
```

- Android emulator: usar `http://10.0.2.2:8080/api` (default no app)
- Host customizado: definir `EXPO_PUBLIC_API_URL`

---

## 🧪 Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend unitário
```bash
cd frontend
npm run test
```

### Frontend E2E
```bash
cd frontend
npm run test:e2e
```

### Mobile
```bash
cd mobile
npm run type-check
```

---

## 🐳 Produção com Docker

```bash
cp .env.prod.example .env
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📚 Documentação

- [`STATUS_PROJETO.md`](./STATUS_PROJETO.md): status por fase e progresso consolidado
- [`INTEGRACAO_FRONTEND_BACKEND.md`](./INTEGRACAO_FRONTEND_BACKEND.md): integração API/web
- [`DESENVOLVIMENTO_BACKEND.md`](./DESENVOLVIMENTO_BACKEND.md): estrutura e setup backend
- [`frontend/DESENVOLVIMENTO_FRONTEND.md`](./frontend/DESENVOLVIMENTO_FRONTEND.md): estrutura e setup frontend
- [`TESTES_BACKEND.md`](./TESTES_BACKEND.md): estratégia de testes backend
