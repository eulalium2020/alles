# 🏥 ALLES - Sistema de Gestão de Clínica

Sistema de gestão para clínicas com backend em Spring Boot e frontend em React/TypeScript.

**Status atual (08/07/2026):** backend e frontend web implementados, com autenticação JWT, CRUD principal e migrações Flyway.  
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
- Páginas de gestão:
  - Profissionais
  - Pacientes
  - Atendimentos
  - Planos de Saúde
- Serviços HTTP com interceptação de token JWT
- Hooks e estado global com Zustand
- Testes unitários em serviços, hooks e componentes

---

## 🚀 Como executar localmente

### Pré-requisitos
- Java 17+
- Maven 3.8+
- Node.js 18+
- Docker e Docker Compose (para banco)

### 1. Subir infraestrutura (MySQL)
```bash
cd /home/wsl/projetos/alles
docker-compose up -d
```

### 2. Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/api/swagger-ui.html`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

- Web app: `http://localhost:3000`

---

## 🧪 Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npx vitest run
```

---

## 📚 Documentação

- [`STATUS_PROJETO.md`](./STATUS_PROJETO.md): status por fase e progresso consolidado
- [`INTEGRACAO_FRONTEND_BACKEND.md`](./INTEGRACAO_FRONTEND_BACKEND.md): integração API/web
- [`DESENVOLVIMENTO_BACKEND.md`](./DESENVOLVIMENTO_BACKEND.md): estrutura e setup backend
- [`DESENVOLVIMENTO_FRONTEND.md`](./DESENVOLVIMENTO_FRONTEND.md): estrutura e setup frontend
- [`TESTES_BACKEND.md`](./TESTES_BACKEND.md): estratégia de testes backend

---

## 📍 Próximos blocos de trabalho

- Expansão de cobertura de testes (frontend + integração end-to-end)
- Canal mobile (React Native)
- Pipeline de deploy/CI-CD para produção
