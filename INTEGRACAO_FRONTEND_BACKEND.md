# 🌐 INTEGRAÇÃO FRONTEND + BACKEND

## 📊 Status

| Componente | Status | Descrição |
|------------|--------|-----------|
| Backend Java/Spring | ✅ Pronto | 80 arquivos, API REST completa |
| Frontend React | ✅ Pronto | Estrutura SOLID, autenticação implementada |
| Integração | ⏳ Próxima | Conectar ambos |

## 🔗 Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                      :3000                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Pages | Components | Hooks | Store (Zustand)         │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│  ┌───────────▼───────────────────────────────────────────┐  │
│  │ Services (authService, profissionalService, etc)     │  │
│  │ + Axios with JWT interceptor                         │  │
│  └───────────┬───────────────────────────────────────────┘  │
└──────────────┼──────────────────────────────────────────────┘
               │ HTTP + JWT
               │ Base URL: http://localhost:8080/api
               │
┌──────────────▼──────────────────────────────────────────────┐
│                    BACKEND (Java)                            │
│                      :8080                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Controllers (REST endpoints)                         │  │
│  │ /api/auth/login, /api/profissionais, etc            │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│  ┌───────────▼───────────────────────────────────────────┐  │
│  │ Services (business logic)                            │  │
│  │ JWT validation, RBAC, data processing               │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│  ┌───────────▼───────────────────────────────────────────┐  │
│  │ Repositories (data access)                           │  │
│  │ JPA/Hibernate → MySQL                               │  │
│  └───────────────────────────────────────────────────────┘  │
│              │                                               │
└──────────────▼──────────────────────────────────────────────┘
               │
          ┌────▼────┐
          │  MySQL  │
          │ :3306   │
          └─────────┘
```

## 📝 Endpoints Implementados

### 🔐 Autenticação (`/api/auth`)

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@alles.com",
  "password": "senha123"
}

Response: {
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "usuario": {
    "id": 1,
    "email": "admin@alles.com",
    "nome": "Admin",
    "perfil": "ADMIN",
    "ativo": true
  }
}

# Refresh Token
POST /api/auth/refresh
Content-Type: application/json
Authorization: Bearer <refreshToken>

# Logout
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

### 👨‍⚕️ Profissionais (`/api/profissionais`)

```bash
# Listar
GET /api/profissionais?page=0&size=10
Authorization: Bearer <token>

# Por ID
GET /api/profissionais/{id}
Authorization: Bearer <token>

# Criar
POST /api/profissionais
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Dr. Silva",
  "email": "silva@alles.com",
  "cpf": "123.456.789-00",
  "crm": "123456",
  "especialidadeId": 1,
  "tipoPagamento": "AMBOS",
  "valorFixo": 100.00,
  "percentualReceita": 25.0
}

# Atualizar
PUT /api/profissionais/{id}
Authorization: Bearer <token>

# Deletar
DELETE /api/profissionais/{id}
Authorization: Bearer <token>
```

### 🏥 Pacientes (`/api/pacientes`)

```bash
# Listar
GET /api/pacientes
Authorization: Bearer <token>

# Criar
POST /api/pacientes
Authorization: Bearer <token>

# Atualizar
PUT /api/pacientes/{id}
Authorization: Bearer <token>

# Deletar
DELETE /api/pacientes/{id}
Authorization: Bearer <token>
```

### 📅 Atendimentos (`/api/atendimentos`)

```bash
# Listar
GET /api/atendimentos

# Agendar
POST /api/atendimentos/agendar
{
  "profissionalId": 1,
  "pacienteId": 1,
  "dataHora": "2024-07-10T14:00:00",
  "tipoAtendimento": "PRESENCIAL"
}

# Registrar (marcar como realizado)
POST /api/atendimentos/{id}/registrar
{
  "anotacoes": "Paciente apresenta...",
  "valorCobrado": 150.00
}

# Cancelar
POST /api/atendimentos/{id}/cancelar
{
  "motivo": "Paciente não compareceu"
}
```

### 💰 Pagamentos (`/api/pagamentos`)

```bash
# Listar por profissional
GET /api/pagamentos?profissionalId=1&mes=2024-07

# Processar
POST /api/pagamentos/{id}/processar
{
  "metodo": "TRANSFERENCIA_BANCARIA"
}

# Relatório Mensal
GET /api/relatorios/pagamentos?profissionalId=1&mes=2024-07
```

## 🔌 Configuração de Endpoints

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8080/api
```

### Vite Proxy (vite.config.ts)

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## 🔐 Fluxo de Autenticação Completo

### 1. Login

```typescript
// Frontend
const { login } = useAuth()
await login({ email, password })

// → POST /api/auth/login
// ← { accessToken, refreshToken, usuario }

// Salva em localStorage
localStorage.setItem('alles_access_token', accessToken)
localStorage.setItem('alles_refresh_token', refreshToken)
localStorage.setItem('alles_user', JSON.stringify(usuario))

// Atualiza Zustand store
setUsuario(usuario)
setIsAuthenticated(true)
```

### 2. Requisições Autenticadas

```typescript
// useHttp.ts interceptor
const client = axios.create(...)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('alles_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Todas as requisições têm:
// Authorization: Bearer <token>
```

### 3. Token Expirado

```typescript
// Interceptor de resposta
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, tentar refresh
      const refreshToken = localStorage.getItem('alles_refresh_token')
      try {
        const response = await client.post('/auth/refresh', { refreshToken })
        const newAccessToken = response.data.accessToken
        
        // Atualiza localStorage
        localStorage.setItem('alles_access_token', newAccessToken)
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${newAccessToken}`
        return client(error.config)
      } catch {
        // Refresh falhou, redirecionar para login
        navigate('/login')
      }
    }
    return Promise.reject(error)
  }
)
```

## 🚀 Como Rodar Ambos

### Terminal 1: Backend

```bash
cd /home/wsl/projetos/alles/backend

# Iniciar MySQL
docker-compose up -d

# Build e run
mvn clean install
mvn spring-boot:run

# Ou com Java direto
java -jar target/alles-backend-1.0.0.jar

# Backend disponível em http://localhost:8080
# Swagger em http://localhost:8080/api/swagger-ui.html
```

### Terminal 2: Frontend

```bash
cd /home/wsl/projetos/alles/frontend

# Instalar dependências (REQUER NODE 18+)
npm install

# Rodar em desenvolvimento
npm run dev

# Frontend disponível em http://localhost:3000
```

## ✅ Checklist de Integração

- [ ] Backend rodando em http://localhost:8080
- [ ] MySQL rodando (via docker-compose)
- [ ] Frontend rodando em http://localhost:3000
- [ ] Consegue fazer login (admin@alles.com / senha)
- [ ] Token JWT aparece no localStorage
- [ ] Consegue acessar /dashboard
- [ ] Consegue fazer logout
- [ ] Swagger backend acessível
- [ ] Swagger mostra todos os endpoints
- [ ] CORS habilitado no backend

## 🐛 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solução**: Backend já tem CORS configurado em `SecurityConfig.java`

### Token 401 Unauthorized

1. Verificar se token está no localStorage
2. Verificar expiração: `node -e "console.log(new Date(1688...))"`
3. Verificar SECRET no `application.yml`

### Conexão Recusada em localhost:8080

1. Verificar se backend está rodando: `curl http://localhost:8080`
2. Verificar se MySQL está ativo: `docker ps`
3. Checar logs: `mvn spring-boot:run`

## 📈 Performance

### Frontend Optimizations

1. **Code Splitting** - Lazy load pages
   ```typescript
   const ProfissionaisPage = lazy(() => 
     import('@pages/ProfissionaisPage')
   )
   ```

2. **Memoization** - Evitar re-renders
   ```typescript
   const Component = memo(({ data }) => ...)
   ```

3. **Caching** - Guardar dados em Zustand
   ```typescript
   const { profissionais } = useProfissionalStore()
   ```

### Backend Optimizations

1. **Índices** - MySQL com índices em CPF, email, CRM
2. **Paginação** - Sempre usar page/size
3. **Lazy Loading** - Evitar carregamento de relacionamentos desnecessários

## 🔗 Próximas Fases

### Curto Prazo (1-2 semanas)
- [ ] Implementar CRUD de Profissionais (Frontend)
- [ ] Implementar CRUD de Pacientes (Frontend)
- [ ] Agendamento de Atendimentos
- [ ] Formulários com validação
- [ ] Error handling aprimorado

### Médio Prazo (2-4 semanas)
- [ ] Testes automatizados (Frontend + Backend)
- [ ] Relatórios de pagamento
- [ ] Dashboard com gráficos
- [ ] Notificações (toast messages)
- [ ] Filtros e busca

### Longo Prazo (4+ semanas)
- [ ] Mobile React Native (mesmo backend)
- [ ] Integração com gateway de pagamento
- [ ] Agendamento automático
- [ ] Telemedicina (video call)
- [ ] Deployment (AWS/Docker)

## 📚 Documentação de Referência

- Backend: `/home/wsl/projetos/alles/ARQUITETURA.md`
- Frontend: `/home/wsl/projetos/alles/frontend/DESENVOLVIMENTO_FRONTEND.md`
- Tipos: `/home/wsl/projetos/alles/frontend/src/types/index.ts`
- Modelo Dados: `/home/wsl/projetos/alles/MODELO_DADOS.md`
- Fluxogramas: `/home/wsl/projetos/alles/FLUXOGRAMAS.md`

---

**Data**: 02/07/2026  
**Status**: ✅ Pronto para Integração  
**Próximo Passo**: Implementar páginas CRUD no Frontend
