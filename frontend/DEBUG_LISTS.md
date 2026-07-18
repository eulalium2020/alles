# 🔍 Debug - Nomes e Emails não exibidos nas listas

## Problema Relatado
Nomes e emails não estão sendo exibidos nas listas de Pacientes, Profissionais e Atendimentos.

## Causas Possíveis

1. **Dados não chegando do backend** - API retornando lista vazia
2. **Campos vazios (null/undefined)** - Dados sem nome e email
3. **Descompasso de tipos** - Estrutura de resposta diferente do esperado
4. **Erro de mapeamento** - Adapter não está processando corretamente

## Como Debugar

### Passo 1: Verificar Console do Navegador
1. Abra o navegador em `http://localhost:5173`
2. Faça login
3. Navegue para **Pacientes** (ou Profissionais/Atendimentos)
4. Abra DevTools (F12)
5. Vá para **Console**
6. Procure por mensagens como:
   - `📊 PacienteList - Dados recebidos:`
   - `🔍 Pacientes Response:`
   - `📋 Paciente item:`

### Passo 2: Verificar Estrutura de Dados
No console, execute:
```javascript
// Copiar e colar no console
// Para ver dados de Pacientes
JSON.stringify(window.__data, null, 2)

// Ou procure pelos logs:
// Procure por "📊 PacienteList - Dados recebidos"
// Expanda e analise a estrutura
```

### Passo 3: Verificar Resposta da API
1. Abra **Network** (F12 → Network)
2. Recarregue a página
3. Procure pela requisição `GET /api/pacientes?page=0&size=10`
4. Clique na requisição
5. Abra **Response** e verifique se os dados têm `content` com nomes e emails

**Resposta esperada:**
```json
{
  "content": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "cpf": "123.456.789-00",
      "ativo": true,
      ...
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "number": 0,
  "size": 10
}
```

### Passo 4: Verificar Backend
Se a API está retornando dados vazios, o problema está no backend:

```bash
# Verificar se backend está rodando
curl -X GET http://localhost:8080/api/profissionais \
  -H "Authorization: Bearer <TOKEN>"

# Ou use a interface Swagger
http://localhost:8080/api/swagger-ui.html
```

## Possíveis Soluções

### Cenário 1: Dados vazios no backend
**Sintoma:** `"content": []` na resposta

**Solução:**
1. Verifique se há dados seeded no banco
2. Crie um novo paciente/profissional via API
3. Verifique se o JWT está válido

### Cenário 2: Campos são null/undefined
**Sintoma:** Linhas aparecem mas com valores vazios

**Solução:**
1. Backend não está salvando dados corretamente
2. Verificar campos obrigatórios no formulário
3. Validar payload sendo enviado ao criar

### Cenário 3: Adapter não está processando
**Sintoma:** Console mostra erro em `adaptSpringPage`

**Solução:**
1. Verificar estrutura de resposta do Spring
2. Certificar que resposta tem: `content`, `number`, `size`, `totalElements`, `totalPages`

### Cenário 4: Problema com CSS/Display
**Sintoma:** Dados no console mas não aparecem na tela

**Solução:**
1. Verificar se há CSS ocultando as células
2. Inspelionar elemento (F12 → Inspecionar)
3. Verificar cor do texto (pode estar branco em fundo branco)
4. Verificar `display: none` ou `visibility: hidden`

## Quick Checks

### ✅ Verificar integridade dos dados
```javascript
// No console
const tables = document.querySelectorAll('table tbody tr');
console.log('Linhas da tabela:', tables.length);
tables.forEach((tr, i) => {
  const cells = tr.querySelectorAll('td');
  console.log(`Linha ${i}:`, cells[0]?.textContent, cells[1]?.textContent);
});
```

### ✅ Verificar se campos têm valor
```javascript
// Procure pelos logs: "📋 Paciente item:"
// e verifique se tem { nome: "...", email: "..." }
```

### ✅ Verificar requisição à API
```javascript
// Network → Procure por GET /pacientes
// Clique e veja o Response e Status
```

## Logs Adicionados

Os seguintes console.logs foram adicionados para debug:

### PacientesPage.tsx
```javascript
console.log('🔍 Pacientes Response:', response)
console.log('🔍 Pacientes Content:', response?.content)
```

### PacienteList.tsx
```javascript
console.log('📊 PacienteList - Dados recebidos:', { pacientes, pagination })
console.log('📋 Paciente item:', pac) // Para cada item
```

## Arquivos Relacionados

- `src/services/pacienteService.ts` - Faz requisição GET /pacientes
- `src/utils/paginationAdapter.ts` - Adapta resposta do Spring
- `src/hooks/usePaciente.ts` - Gerencia estado
- `src/pages/PacientesPage.tsx` - Page que usa hook
- `src/components/PacienteList.tsx` - Componente que renderiza

## Próximos Passos

1. ✅ Adicione os debugs acima
2. 📊 Capture os logs do console
3. 📡 Verifique resposta da API no Network
4. 📝 Compartilhe os dados coletados
5. 🔧 Aplique a solução apropriada

## Contato

Se continuar com o problema:
1. Compartilhe os logs do console
2. Compartilhe a resposta da requisição GET /pacientes
3. Verifique backend em `http://localhost:8080/api/swagger-ui.html`

---

**Data:** 18/07/2026  
**Status:** 🔧 Em Debug
