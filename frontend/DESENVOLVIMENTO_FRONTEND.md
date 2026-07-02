# 📖 GUIA DE DESENVOLVIMENTO FRONTEND

## 🎯 Visão Geral

O frontend React web segue os **princípios SOLID** e arquitetura em camadas, com foco em:
- ✅ Type Safety (TypeScript)
- ✅ Reutilização de componentes
- ✅ Testabilidade
- ✅ Performance (Vite + lazy loading)
- ✅ UX/Responsividade (Tailwind)

## 📁 Estrutura de Pastas

```
frontend/src/
│
├── components/         # Componentes reutilizáveis (Presentational)
│   ├── ProfissionalCard.tsx
│   ├── AtendimentoForm.tsx
│   ├── RelatorioTable.tsx
│   └── ...
│
├── pages/              # Páginas/Views (Container components)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfissionaisPage.tsx
│   ├── PacientesPage.tsx
│   ├── AtendimentosPage.tsx
│   └── RelatoriosPage.tsx
│
├── services/           # Business logic & API (SOLID - Single Responsibility)
│   ├── authService.ts      # Autenticação e tokens
│   ├── profissionalService.ts  # CRUD profissionais
│   ├── pacienteService.ts      # CRUD pacientes
│   ├── atendimentoService.ts   # Agendamentos e atendimentos
│   ├── pagamentoService.ts     # Cálculos e processamento
│   └── relatorioService.ts     # Geração de relatórios
│
├── hooks/              # Custom hooks (Application layer)
│   ├── useAuth.ts          # Login/logout flow
│   ├── useHttp.ts          # Requisições HTTP com interceptors
│   ├── useProfissional.ts  # Fetch/mutate profissionais
│   ├── usePaciente.ts      # Fetch/mutate pacientes
│   ├── useAtendimento.ts   # Agendamento e registro
│   └── usePagamento.ts     # Processamento de pagamentos
│
├── store/              # State management (Zustand)
│   ├── authStore.ts        # Autenticação global
│   ├── uiStore.ts          # UI state (modals, notifications)
│   └── appStore.ts         # App global state
│
├── types/              # TypeScript interfaces (Domain layer)
│   └── index.ts            # Todos os tipos centralizados
│
├── utils/              # Utilitários
│   ├── formatters.ts   # Formatação (data, moeda, CPF, etc)
│   ├── validators.ts   # Validações de negócio
│   ├── formatDate.ts
│   └── currency.ts
│
├── constants/          # Constantes
│   ├── api.ts         # URLs, timeouts, configurações
│   └── roles.ts       # Perfis/permissões
│
├── layouts/            # Layouts reutilizáveis
│   ├── MainLayout.tsx     # Com header/nav
│   ├── AuthLayout.tsx     # Para login
│   └── AdminLayout.tsx    # Painel admin
│
├── App.tsx             # Router e root component
├── main.tsx            # Entry point
├── index.css           # Tailwind styles
```

## 🔐 Autenticação & Segurança

### Flow de Login

```typescript
// 1. Usuário submete credenciais
const { login } = useAuth()
await login({ email, password })

// 2. authService.ts:
// - Chama POST /api/auth/login
// - Recebe { accessToken, refreshToken, usuario }
// - Armazena em localStorage

// 3. Store é atualizado (useAuthStore)
// - usuario e isAuthenticated

// 4. Redireciona para /dashboard
```

### Token Refresh Automático

```typescript
// useHttp.ts interceptor:
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      // Chamar POST /api/auth/refresh
      // Se falhar, redirecionar para login
    }
    return Promise.reject(error)
  }
)
```

### Proteção de Rotas

```typescript
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <MainLayout>{children}</MainLayout>
}
```

## 🏗️ Camadas & Responsabilidades

### 1️⃣ Presentation Layer (pages + components)

**Responsabilidades**:
- Renderizar UI
- Capturar eventos do usuário
- Chamar hooks do application layer

**Exemplo**:
```typescript
export const ProfissionaisPage: React.FC = () => {
  const { profissionais, loading, error } = useProfissional()
  
  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}
      <ProfissionalList profissionais={profissionais} />
    </div>
  )
}
```

### 2️⃣ Application Layer (hooks)

**Responsabilidades**:
- Orquestrar lógica de negócio
- Gerenciar estado local
- Chamar services

**Exemplo**:
```typescript
export function useProfissional() {
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(false)
  const { get } = useHttp()
  
  const fetchAll = async (page = 1) => {
    setLoading(true)
    try {
      const data = await get(`/profissionais?page=${page}`)
      setProfissionais(data)
    } finally {
      setLoading(false)
    }
  }
  
  return { profissionais, loading, fetchAll }
}
```

### 3️⃣ Domain Layer (types)

**Responsabilidades**:
- Definir interfaces
- Business rules
- Validações

```typescript
interface Profissional extends Usuario {
  especialidade: Especialidade
  crm: string
  tipoPagamento: TipoPagamento
}
```

### 4️⃣ Infrastructure Layer (services)

**Responsabilidades**:
- Chamadas HTTP
- Transformação de dados
- Cache/storage

**Exemplo**:
```typescript
export class ProfissionalService {
  private http: AxiosInstance
  
  async findById(id: number): Promise<Profissional> {
    const response = await this.http.get(`/profissionais/${id}`)
    return response.data
  }
  
  async save(profissional: Profissional): Promise<Profissional> {
    const response = await this.http.post('/profissionais', profissional)
    return response.data
  }
}
```

## 🔄 Padrões de Código

### Custom Hook Pattern

```typescript
// Padrão: use[Recurso]
export function usePaciente(id?: number) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await pacienteService.findById(id!)
      setPaciente(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [id])
  
  useEffect(() => {
    if (id) fetch()
  }, [id, fetch])
  
  return { paciente, loading, error, refetch: fetch }
}
```

### Service Pattern

```typescript
// Padrão: [Recurso]Service com Interface IService
export interface IProfissionalService {
  getAll(page: number): Promise<PaginatedResponse<Profissional>>
  getById(id: number): Promise<Profissional>
  create(data: CreateProfissionalDTO): Promise<Profissional>
  update(id: number, data: UpdateProfissionalDTO): Promise<Profissional>
  delete(id: number): Promise<void>
}

export class ProfissionalService implements IProfissionalService {
  // implementação...
}
```

### Formulários Validados

```typescript
interface FormState {
  nome: string
  email: string
  errors: Record<string, string>
}

const [form, setForm] = useState<FormState>({
  nome: '',
  email: '',
  errors: {}
})

const validate = () => {
  const errors: Record<string, string> = {}
  if (!form.nome) errors.nome = 'Nome é obrigatório'
  if (!isValidEmail(form.email)) errors.email = 'Email inválido'
  setForm(prev => ({ ...prev, errors }))
  return Object.keys(errors).length === 0
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validate()) return
  
  // submit...
}
```

## 📊 State Management (Zustand)

### Global Auth Store

```typescript
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    usuario: null,
    isAuthenticated: false,
    
    setUsuario: (usuario) => set({ usuario }),
    hasRole: (role) => get().usuario?.perfil === role,
  }))
)

// Usar em componentes
const usuario = useAuthStore(state => state.usuario)
const hasRole = useAuthStore(state => state.hasRole)
```

### Selectors (Derived State)

```typescript
// ✅ Bom - Memoized selector
const selectIsAdmin = (state: AuthState) => 
  state.usuario?.perfil === 'ADMIN'

const isAdmin = useAuthStore(selectIsAdmin)

// ❌ Ruim - Sem memoização
const isAdmin = useAuthStore(state => 
  state.usuario?.perfil === 'ADMIN'
)
```

## 🧪 Testing (TODO)

### Estrutura de Testes

```
src/
├── __tests__/
│   ├── services/
│   │   └── authService.test.ts
│   ├── hooks/
│   │   └── useAuth.test.ts
│   ├── pages/
│   │   └── LoginPage.test.tsx
│   └── store/
│       └── authStore.test.ts
```

### Exemplo de Teste

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@hooks/useAuth'

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    expect(result.current.usuario).toBeDefined()
  })
})
```

## 🚀 Performance

### Code Splitting

```typescript
// Lazy load pages
const ProfissionaisPage = lazy(() => 
  import('@pages/ProfissionaisPage')
)

// Em App.tsx
<Suspense fallback={<Loading />}>
  <ProfissionaisPage />
</Suspense>
```

### Memoization

```typescript
// Memoizar componentes caros
export const ProfissionalCard = memo(({ profissional }) => (
  <div>{profissional.nome}</div>
))

// Memoizar callbacks
const handleClick = useCallback(() => {
  // handler
}, [dependency])
```

## 📝 Convenções

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `ProfissionalCard.tsx` |
| Hooks | camelCase (use prefix) | `useProfissional.ts` |
| Services | camelCase | `authService.ts` |
| Types/Interfaces | PascalCase | `Profissional.ts` |
| Variáveis/funções | camelCase | `handleSubmit`, `usuario` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL`, `TIMEOUT` |
| Pastas | kebab-case | `auth-service/`, `form-fields/` |
| CSS Classes | kebab-case | `form-group`, `btn-primary` |

## 🔗 Integração com Backend

### Headers Padrão

```typescript
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Tratamento de Erros

```typescript
try {
  const data = await apiClient.get('/profissionais')
} catch (error) {
  if (error.status === 401) {
    // Não autenticado
    navigate('/login')
  } else if (error.status === 403) {
    // Sem permissão
    showError('Acesso negado')
  } else if (error.status === 400) {
    // Validação
    showFieldErrors(error.fieldErrors)
  } else {
    // Erro genérico
    showError('Algo deu errado')
  }
}
```

## 🛠️ Troubleshooting

### Import Paths não funcionando

```typescript
// ❌ Ruim
import { useAuth } from '../../../hooks/useAuth'

// ✅ Bom (ver tsconfig.json paths)
import { useAuth } from '@hooks/useAuth'
```

### CORS Error

1. Verificar `vite.config.ts` proxy
2. Backend deve ter CORS habilitado
3. Headers corretos

### Type Errors

```bash
npm run type-check
```

## 📚 Referências Internas

- **Backend API**: `http://localhost:8080/api`
- **Tipos compartilhados**: `/src/types/index.ts`
- **Constantes**: `/src/constants/api.ts`
- **Arquitetura geral**: `../ARQUITETURA.md`
- **Convenções**: `../CONVENÇÕES_E_PADRÕES.md`

---

**Última Atualização**: 02/07/2026  
**Próxima Fase**: Implementação de páginas CRUD (Profissionais, Pacientes, Atendimentos)
