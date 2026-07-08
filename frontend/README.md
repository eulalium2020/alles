# 🌐 ALLES Frontend

Frontend web do ALLES, construído com **React 18 + TypeScript + Vite**.

## Status atual

**Atualizado em 08/07/2026:** autenticação, rotas protegidas e páginas principais de gestão já implementadas.

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router v6
- Zustand
- Axios
- TailwindCSS
- Vitest

## Funcionalidades implementadas

- Login e sessão com JWT
- Dashboard
- Gestão de Profissionais
- Gestão de Pacientes
- Gestão de Atendimentos
- Gestão de Planos de Saúde

## Rotas da aplicação

- `/login`
- `/dashboard`
- `/profissionais`
- `/pacientes`
- `/atendimentos`
- `/planos-saude`

## Setup local

### Pré-requisitos
- Node.js 18+
- npm

### Instalação e execução

```bash
cd frontend
npm install
npm run dev
```

Aplicação local: `http://localhost:3000`

## Build

```bash
npm run build
npm run preview
```

## Qualidade e testes

```bash
npm run lint
npm run type-check
npx vitest run
```
