# 📋 SPEC - Sistema de Gestão de Clínica (SDD)
**Data**: 02/07/2026  
**Versão**: 1.0 - Draft Aguardando Validação

> Este documento contém **32 perguntas críticas** que precisam ser respondidas antes de iniciar o desenvolvimento.
> Siga o modelo SDD (Spec-Driven Development): esclareça requisitos → defina arquitetura → implemente

---

## ❓ QUESTÕES CRÍTICAS PARA APROVAÇÃO

### 🏗️ ARQUITETURA E TECNOLOGIA

**Q1**: Qual stack preferido?
- [ ] Node.js/Express (Backend) + React (Frontend)
- [ ] Node.js/NestJS + React
- [ ] Python/FastAPI + React
- [x] Java/Spring + React
- [ ] Outro: _______

**Q2**: Banco de dados?
- [ ] PostgreSQL
- [x] MySQL
- [ ] MongoDB
- [ ] Outro: _______

**Q3**: Para migração mobile:
- [x] React Native
- [ ] Flutter
- [ ] Nativo (Swift/Kotlin)
- [ ] Futura (ainda não definido)

---

### 👥 CONTROLE DE ACESSO

**Q4**: Perfis de usuário:
- [x] Profissional, Paciente, Recepcionista, Admin (obrigatório)
- [ ] Outros: _______

**Q5**: Autenticação:
- [x] Simples (email + senha)
- [ ] Com 2FA
- [ ] OAuth (Google/Microsoft)
- [ ] CPF como identificador

---

### 📋 CADASTROS

**Q6**: Profissional deve ter:
- [x] Nome, CPF, CRM/CREFITO, especialidade(s), dados bancários
- [x] Horários de atendimento
- [ ] Adicionar: _______

**Q7**: Um profissional pode ter múltiplas especialidades?
- [ ] Sim
- [x] Não

**Q8**: Paciente deve ter:
- [x] Nome, CPF, data nascimento, email, telefone, endereço
- [x] Alergias e antecedentes médicos
- [ ] Adicionar: _______

**Q9**: Planos de Saúde - modelo:
- [ ] Cada paciente = 1 plano
- [x] Cada paciente = múltiplos planos
- [x] Particular + com plano

**Q10**: Plano inclui:
- [ ] Cobertura percentual por especialidade
- [ ] Valor de copay
- [x] Autorização de procedimentos
- [ ] Apenas nome e cobertura básica

---

### 📅 ATENDIMENTOS

**Q11**: Agendamento:
- [ ] Por profissional
- [ ] Compartilhado (clínica)
- [x] Ambos

**Q12**: Tipos de atendimento:
- [ ] Presencial
- [ ] Telemedicina
- [x] Ambos

**Q13**: Registro de atendimento inclui:
- [ ] Paciente, profissional, data/hora, duração
- [ ] Diagnóstico/observações
- [ ] Procedimentos realizados
- [x] Tudo

---

### 💰 PAGAMENTOS

**Q14**: Profissional recebe por:
- [ ] Valor fixo/consulta
- [ ] Percentual da receita
- [x] Ambos (configurável)

**Q15**: Cálculo diferencia:
- [ ] Atendimento particular vs com plano
- [ ] Desconto da clínica
- [x] Ambos

**Q16**: Relatório mensal mostra:
- [ ] Quantidade de atendimentos
- [ ] Valor bruto gerado
- [ ] Deduções
- [ ] Valor a receber
- [x] Tudo

**Q17**: Quem visualiza relatório de pagamento?
- [x] Profissional + Admin
- [ ] Apenas Admin
- [ ] Apenas Profissional

---

### 📊 RELATÓRIOS E DOCUMENTAÇÃO

**Q18**: Prontuário eletrônico necessário?
- [x] Completo (anamnese, diagnósticos, prescrições)
- [ ] Básico (apenas histórico)
- [ ] Não é prioridade

**Q19**: Requisitos de segurança/LGPD:
- [ ] Criptografia de dados sensíveis
- [ ] Auditoria de acesso
- [ ] Backup automático
- [x] Todas

**Q20**: Relatórios extras (além do mensal):
- [ ] Taxa de ocupação (agendados vs realizados)
- [ ] Receita por especialidade
- [x] Cancelamentos/faltas
- [ ] Nenhum extra

---

### ⏱️ TIMELINE E ESCOPO

**Q21**: Primeira entrega será:
- [ ] MVP (funcionalidades essenciais)
- [x] Sistema completo
- [ ] Fases? Descreva: _______

**Q22**: Timeline esperada:
- [ ] MVP: _____ semanas
- [x] Completo: _____ semanas

---

## 📊 PRÓXIMOS PASSOS APÓS RESPOSTAS

1. **Modelos de Dados** → ERD (Entity Relationship Diagram)
2. **Fluxogramas** → Fluxo de negócio (atendimento, pagamento, etc)
3. **Arquitetura** → Estrutura de pastas, padrões de design
4. **Desenvolvimento** → Iniciar codebase

---

## 🎯 PARA APROVAÇÃO

**Favor responder as 22 perguntas (Q1-Q22) acima e enviar de volta.**

Após suas respostas, entregarei:
- ✅ ERD com modelos de dados
- ✅ Fluxogramas de processos
- ✅ Arquitetura técnica
- ✅ Estrutura inicial do projeto
- ✅ Documento de padrões e convenções

---

## 🔧 HISTÓRICO DE MUDANÇAS TÉCNICAS

### 03/07/2026 — Limpeza de Imports (Code Quality)

**Correção de alias de tipos** (`@types/index` → `@/types`):
- Padronizado em 27 arquivos (`services/`, `pages/`, `components/`, `hooks/`)
- Alias correto conforme `tsconfig.json` paths: `"@/*": ["src/*"]`

**Remoção de imports não utilizados** (erros `TS6133`):

| Arquivo | Import removido |
|---|---|
| `src/components/ProfissionalForm.tsx` | `useEffect` (react), prop `especialidades` desestruturada |
| `src/components/ProfissionalList.tsx` | `useState`, `useEffect` (react), `PaginatedResponse` |
| `src/hooks/useProfissional.ts` | `useEffect` (react) |
| `src/services/planoSaudeService.ts` | `AxiosError` (axios) |

**Resultado**: `tsc --noEmit` passa sem erros com `noUnusedLocals: true` e `noUnusedParameters: true`.

