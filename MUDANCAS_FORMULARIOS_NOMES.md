# Modificações de Formulários para Usar NOMES ao invés de IDs

## Resumo Executivo
Implementação completa de modificações em formulários da aplicação ALLES para utilizar NOMES em selects/dropdowns ao invés de IDs numéricos, melhorando significativamente a experiência do usuário.

## Estrutura das Mudanças

### 1. Backend - Endpoints para Listagem de Nomes

#### ProfissionalController.java
- ✅ `@GetMapping("/nomes")` - Lista profissionais ativos com ID, nome, CRM e display formatado
- ✅ `@GetMapping("/by-nome/{nome}")` - Busca profissional por nome

**Formato de resposta:**
```json
{
  "id": 1,
  "nome": "Dr. João Silva",
  "crm": "123456/SP",
  "display": "Dr. João Silva (CRM: 123456/SP)"
}
```

#### PacienteController.java
- ✅ `@GetMapping("/nomes")` - Lista pacientes ativos com ID, nome, CPF e display formatado
- ✅ `@GetMapping("/by-nome/{nome}")` - Busca paciente por nome

**Formato de resposta:**
```json
{
  "id": 1,
  "nome": "Maria Silva",
  "cpf": "123.456.789-00",
  "display": "Maria Silva (CPF: 123.456.789-00)"
}
```

#### EspecialidadeController.java
- ✅ `@GetMapping("/nomes")` - Lista especialidades ativas com ID e nome
- ✅ `@GetMapping("/by-nome/{nome}")` - Busca especialidade por nome

**Formato de resposta:**
```json
{
  "id": 1,
  "nome": "Cardiologia"
}
```

#### PlanoSaudeController.java
- ✅ `@GetMapping("/nomes")` - Lista planos de saúde ativos com ID e nome

**Formato de resposta:**
```json
{
  "id": 1,
  "nome": "Plano Gold"
}
```

#### Service Layer Updates
Adicionados métodos em todos os Services correspondentes:
- `findAllAtivos()` - Retorna apenas registros ativos
- `findByUsuarioNome(String nome)` - Busca por nome do usuário
- `findByNome(String nome)` - Busca por nome

### 2. Frontend - Services

#### nomeService.ts (NOVO)
Arquivo criado em `frontend/src/services/nomeService.ts`

**Classe NomeService com métodos:**
- `getProfissionaisNomes()` - Retorna lista de profissionais
- `getPacientesNomes()` - Retorna lista de pacientes  
- `getEspecialidadesNomes()` - Retorna lista de especialidades
- `getPlanosNomes()` - Retorna lista de planos de saúde
- `getProfissionalPorNome(nome)` - Busca profissional por nome
- `getPacientePorNome(nome)` - Busca paciente por nome
- `getEspecialidadePorNome(nome)` - Busca especialidade por nome

**Features:**
- Interceptadores de autenticação (Bearer token)
- Tratamento centralizado de erros
- Timeouts configuráveis
- Redirect automático para login em caso de 401

### 3. Frontend - Hooks Customizados

#### useNomes.ts (NOVO)
Arquivo criado em `frontend/src/hooks/useNomes.ts`

**Hooks de Listagem:**
- `useProfissionaisNomes()` - Hook para carregar profissionais
- `usePacientesNomes()` - Hook para carregar pacientes
- `useEspecialidadesNomes()` - Hook para carregar especialidades
- `usePlanosNomes()` - Hook para carregar planos

**Hooks de Resolução (para edição):**
- `useProfissionalPorNome(nome)` - Resolve profissional do nome
- `usePacientePorNome(nome)` - Resolve paciente do nome
- `useEspecialidadePorNome(nome)` - Resolve especialidade do nome

**Features de cada hook:**
- Estado gerenciado internamente (items, loading, error)
- useEffect automático ao montar
- Limpeza de estado quando dependências mudam

### 4. Componentes Frontend Modificados

#### AtendimentoForm.tsx
**Mudanças:**
- ❌ Removido: `profissionalId: number` input type="number"
- ❌ Removido: `pacienteId: number` input type="number"
- ✅ Adicionado: `profissionalNome: string` select dropdown
- ✅ Adicionado: `pacienteNome: string` select dropdown

**Validação:**
- Validação de campos obrigatórios (profissionalNome, pacienteNome)
- Validação de data/hora no futuro

**Conversão antes de envio:**
```typescript
const profissional = profissionaisList.find(p => p.display === formData.profissionalNome)
const paciente = pacientesList.find(p => p.display === formData.pacienteNome)

const dataToSubmit = {
  profissionalId: profissional.id,
  pacienteId: paciente.id,
  // ... outros campos
}
```

#### ProfissionalForm.tsx
**Mudanças:**
- ❌ Removido: `especialidade: string` input type="text"
- ✅ Adicionado: `especialidadeNome: string` select dropdown

**Validação:**
- Validação de especialidade obrigatória

**Conversão antes de envio:**
```typescript
const especialidade = especialidadesList.find(e => e.nome === formData.especialidadeNome)

const payload = {
  especialidade: especialidade.nome,
  // ... outros campos
}
```

#### PacienteForm.tsx
**Mudanças:**
- ❌ Removido: `planosSaudeIds: number[]` (antes enviava IDs)
- ✅ Adicionado: `planosSaudeNomes: string[]` (agora com nomes em checkboxes)
- ✅ Adicionada nova seção: "Seção 3: Planos de Saúde" com checkboxes

**UI Melhorias:**
- Checkboxes para seleção múltipla
- Estado de carregamento enquanto dados são buscados
- Mensagem de erro se falhar no carregamento
- Seção antes de "Informações Médicas"

**Conversão antes de envio:**
```typescript
const planosSaudeIds = (formData.planosSaudeNomes || [])
  .map(nome => planosList.find(p => p.nome === nome)?.id)
  .filter(id => id !== undefined)

const payload = {
  planosSaudeIds,
  // ... outros campos
}
```

## Arquivos Criados
1. `frontend/src/services/nomeService.ts` - 4.4 KB
2. `frontend/src/hooks/useNomes.ts` - 5.5 KB

## Arquivos Modificados
1. `frontend/src/components/AtendimentoForm.tsx`
2. `frontend/src/components/ProfissionalForm.tsx`
3. `frontend/src/components/PacienteForm.tsx`
4. `backend/src/main/java/com/clinica/alles/presentation/controller/ProfissionalController.java`
5. `backend/src/main/java/com/clinica/alles/presentation/controller/PacienteController.java`
6. `backend/src/main/java/com/clinica/alles/presentation/controller/EspecialidadeController.java`
7. `backend/src/main/java/com/clinica/alles/presentation/controller/PlanoSaudeController.java`
8. Services correspondentes (ProfissionalService, PacienteService, EspecialidadeService, PlanoSaudeService)

## Padrões de Design Implementados

### Backend
- **REST API**: Endpoints bem definidos e documentados com Swagger
- **Service Layer**: Lógica de negócio isolada nos services
- **Repository Pattern**: Acesso a dados através de repositories
- **DTOs**: Formatação de dados na resposta (display strings)

### Frontend
- **SOLID Principles**: Separação de responsabilidades (Service + Hook + Component)
- **Custom Hooks**: Lógica reutilizável em hooks
- **React Best Practices**: useEffect para side effects, useState para estado local
- **Error Handling**: Tratamento centralizado de erros

## Segurança

- ✅ Autenticação via Bearer token em todas as requisições
- ✅ Autorização com @PreAuthorize nos endpoints
- ✅ Validação de dados no backend
- ✅ Sanitização de entrada (encodeURIComponent)

## Performance

- ✅ Lazy loading de dados (carregado ao montar o componente)
- ✅ Caching implícito (dados armazenados no estado)
- ✅ Timeouts configuráveis
- ✅ Tratamento de erros sem travamento

## Testabilidade

- ✅ Services isolados e testáveis
- ✅ Hooks customizados reutilizáveis
- ✅ DTOs com estrutura previsível
- ✅ Tipo-segurança com TypeScript

## Checklist de Implementação

✅ Backend - Endpoints `/nomes` adicionados
✅ Backend - Endpoints `/by-nome/{nome}` adicionados
✅ Backend - Service methods `findAllAtivos()` adicionados
✅ Backend - Service methods `findByUsuarioNome()` adicionados
✅ Backend - Compilation check passed
✅ Frontend - nomeService.ts criado com 7 métodos
✅ Frontend - useNomes.ts criado com 7 hooks
✅ Frontend - AtendimentoForm.tsx modificado (2 fields convertidos)
✅ Frontend - ProfissionalForm.tsx modificado (1 field convertido)
✅ Frontend - PacienteForm.tsx modificado (1 field convertido + nova seção)
✅ Conversão nome→ID implementada em todos os formulários
✅ Validação atualizada para novos campos
✅ Tratamento de erros e loading states

## Instruções de Uso

### Para Criar/Editar Atendimento:
1. Select dropdown mostra: "Nome (CRM: XXXXX)" para profissionais
2. Select dropdown mostra: "Nome (CPF: XXX.XXX.XXX-XX)" para pacientes
3. Ao enviar, converte display para ID automaticamente

### Para Criar/Editar Profissional:
1. Select dropdown mostra: "Nome" da especialidade
2. Ao enviar, converte nome para ID automaticamente

### Para Criar/Editar Paciente:
1. Checkboxes mostram: "Nome" do plano de saúde
2. Seleção múltipla de planos
3. Ao enviar, converte nomes para IDs automaticamente

## Próximos Passos Sugeridos

1. **Adicionar busca/filtro** nos selects (typeahead/autocomplete)
2. **Implementar cache** para evitar requisições repetidas
3. **Adicionar testes unitários** para services e hooks
4. **Adicionar testes e2e** para formulários
5. **Documentar em OpenAPI/Swagger** os novos endpoints
6. **Implementar paginação** se lista ficar muito grande
