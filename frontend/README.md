# 🌐 ALLES Frontend - React + TypeScript

Frontend web da aplicação ALLES, um sistema de gestão completo para clínicas.

## 📋 Tecnologias

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool (rápido)
- **React Router v6** - Roteamento
- **Zustand** - State Management
- **Axios** - HTTP Client
- **TailwindCSS** - Styling
- **Prettier & ESLint** - Code Quality

## 📁 Estrutura

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/           # Páginas principais
│   ├── services/        # Serviços de API (SOLID)
│   ├── hooks/           # Custom hooks (autenticação, HTTP)
│   ├── store/           # Zustand stores (estado global)
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utilitários
│   ├── constants/       # Constantes da app
│   ├── layouts/         # Layouts compartilhados
│   ├── App.tsx          # Router principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind styles
├── index.html           # HTML template
├── package.json         # Dependências
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
├── postcss.config.js    # PostCSS config
├── .env.example         # Exemplo de variáveis
└── README.md
```

## 🚀 Setup Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cp .env.example .env

# 3. Garantir que backend está rodando em http://localhost:8080
# (Verificar em VITE_API_URL no .env)
```

### Desenvolvimento

```bash
# Rodar em desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

### Build

```bash
# Build para produção
npm run build

# Preview da build
npm run preview
```

### Linting & Formatting

```bash
# Verificar tipos TypeScript
npm run type-check

# Linter
npm run lint

# Prettier formatting
npm run format
```

## 🏛️ Arquitetura (SOLID)

### Camadas

1. **Presentation (pages/components)**
   - Componentes React
   - Páginas/Views

2. **Application (hooks)**
   - Custom hooks
   - Lógica de UI
   - useAuth, useHttp, etc

3. **Domain (types)**
   - Interfaces
   - Types TypeScript
   - Business rules

4. **Infrastructure (services, store)**
   - Serviços de API
   - State management (Zustand)
   - Token management

### Padrões Aplicados

- **Dependency Injection** - Via props e hooks
- **Observer Pattern** - Zustand subscriptions
- **Strategy Pattern** - Serviços intercambiáveis
- **Repository Pattern** - Services abstraem API
- **Adapter Pattern** - Axios interceptors

## 🔐 Autenticação

```typescript
// 1. Login
import { useAuth } from '@hooks/useAuth'

const { login } = useAuth()
await login({ email, password })

// 2. Uso em componentes
const usuario = useUsuario()
const isAuth = useIsAuthenticated()

// 3. Proteção de rotas
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 🎯 APIs Utilizadas

### Backend (Spring Boot 8080)

- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/profissionais` - Listar profissionais
- `POST /api/profissionais` - Criar profissional
- `GET /api/pacientes` - Listar pacientes
- `GET /api/atendimentos` - Listar atendimentos
- `GET /api/relatorios` - Relatórios

## 📦 Principais Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| react | 18.2 | UI Library |
| react-router-dom | 6.16 | Roteamento |
| zustand | 4.4 | State management |
| axios | 1.5 | HTTP client |
| tailwindcss | 3.3 | Styling |
| typescript | 5.2 | Type safety |
| vite | 4.5 | Build tool |

## 🧪 Testes (TODO)

```bash
npm run test
npm run test:coverage
```

## 📝 Convenções

- **Componentes**: PascalCase (`LoginPage.tsx`)
- **Hooks**: camelCase com prefixo "use" (`useAuth.ts`)
- **Services**: camelCase (`authService.ts`)
- **Interfaces**: PascalCase (`Usuario.ts`)
- **Pastas**: kebab-case (`auth-service/`)

## 🚨 Troubleshooting

### CORS Error
- Verificar proxy em `vite.config.ts`
- Backend deve ter CORS configurado

### Token Expirado
- Interceptor automático faz refresh
- Se falhar, redireciona para login

### TypeScript Errors
```bash
npm run type-check
```

## 📚 Referências

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

## 📄 License

© 2026 ALLES. All rights reserved.

## 🤝 Desenvolvimento

1. Criar branch: `git checkout -b feature/nova-funcionalidade`
2. Commit: `git commit -am 'Add nova funcionalidade'`
3. Push: `git push origin feature/nova-funcionalidade`
4. Pull Request

---

**Última Atualização**: 02/07/2026  
**Status**: ✅ Pronto para Desenvolvimento
