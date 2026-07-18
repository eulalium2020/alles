# 🌐 ALLES Frontend - Design System Healthcare

Frontend web do ALLES com **React 18 + TypeScript + Vite** e **Design System Healthcare Profissional**.

## Status atual

**Atualizado em 18/07/2026:** Design system healthcare 100% implementado + formulários com NOMES (name-based selection).

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router v6
- Zustand
- Axios
- CSS Variables (Design System Healthcare)
- Vitest

## 🎨 Design System Healthcare

### Paleta de Cores
- **Primary Blue**: #0A6992 (Confiança, Segurança)
- **Secondary Teal**: #45B69C (Saúde, Equilíbrio)
- **Success Green**: #27AE60 (Positivo)
- **Error Red**: #E74C3C (Alertas)
- **Warning Yellow**: #F39C12 (Aviso)
- **Info Blue**: #3498DB (Informação)

### Tipografia
- **Body**: Open Sans (400, 500, 600, 700)
- **Headings**: Montserrat (600, 700)
- **Line Height**: 1.6 (legibilidade)

### Componentes Refatorados (14)
1. **Header** - Busca, notificações, menu usuário
2. **Sidebar** - Navegação com submenu
3. **Cards** - InfoCard, StatCard com gradientes
4. **StatusBadge** - 4 tipos de status com cores
5. **ThemeToggle** - Light/Dark mode toggle
6. **AtendimentoList** - Tabela com paginação
7. **PacienteList** - Tabela com badges
8. **ProfissionalList** - Tabela com órgão de classe
9. **PacienteForm** - 3 seções, 16 campos
10. **ProfissionalForm** - 3 seções, 17 campos
11. **AtendimentoForm** - 3 seções, status manager
12. **EspecialidadeForm** - Especialidades
13. **PlanoSaudeForm** - Planos de saúde
14. **Utilitários** - healthcare.ts, theme.ts, testes

### 🌓 Dark Mode
- Detecção automática de preferência do sistema
- Manual toggle com botão flutuante (🌙/☀️)
- LocalStorage persistence
- 40+ CSS variables ajustadas para dark
- Contraste WCAG 2.1 AA

### 📱 Responsividade
- **Mobile** (<768px): Font reduzido, padding menor, sidebar toggle
- **Tablet** (768-1024px): Layout ajustado, sidebar visível
- **Desktop** (>1024px): Sidebar fixo, espaçamento generoso
- Touch targets ≥ 44px

### Padrões de Design
- **Botões**: Hover com translateY(-2px) + shadow
- **Inputs**: Border azul on focus + shadow
- **Cards**: Shadow padrão + hover effects
- **Transições**: Todas 0.2s ease-in-out
- **Espaçamento**: 6 níveis (xs até 2xl)
- **Border Radius**: 4px (moderno, profissional)

## ✅ Formulários com NOMES (Fase 17)

### Backend - 8 novos endpoints
- `GET /profissionais/nomes` → Lista com formato "Nome (CRM/Órgão)"
- `GET /pacientes/nomes` → Lista com formato "Nome (CPF)"
- `GET /especialidades/nomes` → Lista de especialidades
- `GET /planos-saude/nomes` → Lista de planos
- Variantes `/by-nome/{nome}` para busca individual

### Frontend - Serviços e Hooks
- **`src/services/nomeService.ts`** (4.4KB)
  - 7 métodos para endpoints de nomes
  - Retorna dados com formato display "Nome (ID)"
  
- **`src/hooks/useNomes.ts`** (5.4KB)
  - `useProfissionaisNomes()` - Hook para profissionais
  - `usePacientesNomes()` - Hook para pacientes
  - `useEspecialidadesNomes()` - Hook para especialidades
  - `usePlanosNomes()` - Hook para planos
  - Loading, error, data states inclusos

### Formulários Atualizados
- **AtendimentoForm**: Selects para profissional/paciente
- **ProfissionalForm**: Select para especialidade
- **PacienteForm**: Checkboxes para planos de saúde

### UX Melhorada
- Nomes intuitivos (sem memorizar IDs)
- Display com informações adicionais (CPF, CRM, etc)
- Conversão automática de nome → ID
- Menos erros de entrada
- Interface profissional

## Funcionalidades implementadas

- Login e sessão com JWT
- Dashboard com cards informativos
- Gestão de Profissionais com tabela responsiva
- Gestão de Pacientes com status visual
- Gestão de Atendimentos com paginação
- Gestão de Planos de Saúde
- Dark mode com persistence
- Design profissional healthcare
- Validação de formulários com error handling
- Input masks (CPF, phone, email, currency)
- **✅ Formulários com NOMES**: Cadastro/edição usando nomes, selects com "Nome (CPF/CRM)", conversão automática de nome → ID
- **🎯 Name-based Service**: nomeService.ts com 7 métodos para endpoints /nomes
- **🪝 Custom Hooks**: useNomes.ts com 4 hooks para lazy-loading de listas
- **✅ Formulários com NOMES**: Cadastro/edição usando nomes, selects com "Nome (CPF/CRM)", conversão automática de nome → ID
- **🎯 Name-based Service**: nomeService.ts com 7 métodos para endpoints /nomes
- **🪝 Custom Hooks**: useNomes.ts com 4 hooks para lazy-loading de listas

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

## 🧪 Validação do Design System

### Testes Automáticos
```bash
# No console do navegador:
import { designSystemTests } from '@/utils/designSystemTests'
designSystemTests.runTests()
```

### Guia de Testes Manual
```bash
# Ver instruções completas:
import visualTestGuide from '@/utils/visualTestGuide'
console.log(visualTestGuide.instructions)
```

### Checklist de Validação
- [x] Cores healthcare aplicadas
- [x] Tipografia correta (Open Sans + Montserrat)
- [x] Spacing consistente
- [x] Transições suaves (0.2s)
- [x] Hover effects em botões/cards
- [x] Focus states em inputs
- [x] Dark mode funcional
- [x] Dark mode persiste em localStorage
- [x] Responsividade mobile/tablet/desktop
- [x] Acessibilidade WCAG 2.1 AA

## 📁 Estrutura de Arquivos - Design System

```
src/
├── styles/
│   ├── healthcare.ts      # Constantes: cores, spacing, shadows, fonts
│   └── theme.ts           # Utilities e common styles
├── components/
│   ├── ThemeToggle.tsx    # Light/Dark mode toggle
│   ├── Header.tsx         # Novo design
│   ├── Sidebar.tsx        # Novo design
│   ├── Cards.tsx          # InfoCard, StatCard
│   ├── StatusBadge.tsx    # Status com cores
│   ├── *List.tsx          # Componentes de lista refatorados
│   └── *Form.tsx          # Formulários refatorados
├── utils/
│   ├── designSystemTests.ts  # Testes automáticos
│   └── visualTestGuide.ts    # Guia prático
└── index.css              # 40+ CSS variables, dark mode, base styles
```
