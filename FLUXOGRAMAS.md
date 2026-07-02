# 🔄 FLUXOGRAMAS - Processos Principais

**Status**: ✅ Aprovado  
**Data**: 02/07/2026

---

## 1️⃣ FLUXO DE AUTENTICAÇÃO E ACESSO

```
┌────────────────────────────────────────────────────────────────┐
│                      USUÁRIO                                   │
│              Acessa www.clinica.alles                          │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│         FRONTEND - Página de Login                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Email: [_________________]                              │  │
│  │ Senha: [_________________]                              │  │
│  │ [Entrar]                                                │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────────────────┘
                 │ POST /api/auth/login
                 │ { email, senha }
                 ▼
┌────────────────────────────────────────────────────────────────┐
│      BACKEND - AuthenticationController                        │
│                                                                │
│  1. Validar email/senha                                        │
│  2. Buscar usuário no BD                                       │
│  3. Comparar senha (BCrypt)                                    │
└────────────────┬─────────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
    ✅ VÁLIDO      ❌ INVÁLIDO
         │               │
         ▼               ▼
    ┌─────────┐    ┌──────────────┐
    │ Gerar   │    │ Retornar erro│
    │ JWT     │    │ 401 Unauthorized
    │ Token   │    └──────────────┘
    └────┬────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  RESPOSTA: { token, refreshToken, perfil, usuario }          │
│            + Dados do usuário (nome, email, perfil)           │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│      FRONTEND - Armazenar Token                                │
│      LocalStorage: { token, refreshToken }                    │
│      Context: { usuario, perfil }                             │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│     FRONTEND - Redirecionar para Dashboard                     │
│     (baseado no perfil do usuário)                             │
│                                                                │
│  - ADMIN → Dashboard Admin (todos os dados)                   │
│  - PROFISSIONAL → Meu Dashboard (meus dados)                  │
│  - PACIENTE → Meus Agendamentos                               │
│  - RECEPCIONISTA → Gerenciador Agendamentos                   │
└────────────────────────────────────────────────────────────────┘

LOGOUT
┌──────────────────────────────────────────┐
│ Usuário clica em SAIR                    │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│ Frontend limpa tokens do LocalStorage    │
│ Frontend redireciona para /login         │
└──────────────────────────────────────────┘
```

---

## 2️⃣ FLUXO DE AGENDAMENTO DE CONSULTA

```
┌───────────────────────────────────────────────────────────────────┐
│                    PACIENTE                                       │
│         "Quero agendar uma consulta"                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│     FRONTEND - Página de Agendamento                              │
│                                                                   │
│  1. Selecionar Especialidade:  [Psicologia ▼]                   │
│  2. Selecionar Profissional:   [Dr. João ▼]                     │
│  3. Ver disponibilidade:       [Calendario]                      │
│  4. Escolher data/hora:        [02/07/2026 14:00]               │
│  5. Informar plano (opcional): [Particular ▼]                   │
│  [Confirmar Agendamento]                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │ GET /api/profissionais?especialidade=1
                     ▼
        ┌─────────────────────────┐
        │ Busca profissionais     │
        │ ativo na especialidade  │
        └──────────┬──────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Retorna lista de        │
        │ profissionais + horários│
        └──────────┬──────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Frontend calcula        │
        │ horários livres         │
        │ (integração com         │
        │ calendar lib)           │
        └──────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│              Usuário confirma agendamento                         │
└────────────────────┬────────────────────────────────────────────┘
                     │ POST /api/atendimentos/agendar
                     │ {
                     │   paciente_id,
                     │   profissional_id,
                     │   data_agendamento,
                     │   hora_inicio,
                     │   tipo_atendimento,
                     │   paciente_plano_saude_id (opcional)
                     │ }
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│        BACKEND - AgendamentoService                               │
│                                                                   │
│  1. Validar disponibilidade do profissional                       │
│     - Verificar horários cadastrados                              │
│     - Verificar se já há atendimento neste horário               │
│                                                                   │
│  2. Validar cobertura do plano (se aplicável)                    │
│     - Se paciente_plano_saude_id foi informado                   │
│     - Verificar se plano cobre especialidade                     │
│     - Settar copay se houver                                     │
│                                                                   │
│  3. Calcular valor_consulta                                       │
│     - Se particular: usar valor_consulta_particular              │
│     - Se plano: usar valor_consulta_plano                        │
│                                                                   │
│  4. Criar Atendimento no BD                                       │
│     INSERT INTO atendimento (...)                                 │
│                                                                   │
│  5. Publicar evento: "AtendimentoAgendadoEvent"                   │
│                                                                   │
│  6. Retornar dados do atendimento agendado                        │
└────────────────────┬────────────────────────────────────────────┘
         ┌───────────┴───────────┐
    ✅ SUCESSO            ❌ ERRO
         │                      │
         ▼                      ▼
    Retorna                  Retorna
    201 Created              erro 400/409
         │                      │
         ├──────────┬───────────┤
         │          │           │
         ▼          ▼           ▼
    Frontend  EmailService  Frontend
    mostra    envia aviso   mostra erro
    sucesso   ao paciente
             + ao prof

```

---

## 3️⃣ FLUXO DE REALIZAÇÃO DE ATENDIMENTO

```
┌───────────────────────────────────────────────────────────────────┐
│         PROFISSIONAL - Dia do Atendimento                         │
│         "Vou registrar o atendimento do paciente"                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│   FRONTEND - Buscar atendimentos agendados do dia                 │
│   GET /api/profissionais/{id}/atendimentos?data=hoje             │
│                                                                   │
│   Mostra lista:                                                   │
│   ┌─────────────────────────────────────────────────────┐        │
│   │ 14:00 - João Silva (CPF: 123.xxx.xxx-xx)           │ [▶]   │
│   │ 15:00 - Maria Santos (CPF: 456.xxx.xxx-xx)         │ [▶]   │
│   │ 16:00 - Pedro Costa (CPF: 789.xxx.xxx.xx)          │ [▶]   │
│   └─────────────────────────────────────────────────────┘        │
└────────────────────┬────────────────────────────────────────────┘
                     │ Profissional clica em [▶]
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│   FRONTEND - Formulário de Atendimento                            │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │ Atendimento de: João Silva                              │  │
│   │ Data: 02/07/2026 14:00                                  │  │
│   │ Especialidade: Psicologia                               │  │
│   │                                                          │  │
│   │ [PRONTUÁRIO]                                            │  │
│   │ Anamnese: ____________________________________          │  │
│   │ Queixa Principal: _________________________           │  │
│   │ Diagnóstico: ____________________________           │  │
│   │ Conduta: ______________________________            │  │
│   │ Observações: __________________________           │  │
│   │                                                          │  │
│   │ [PRESCRIÇÕES]                                           │  │
│   │ + Adicionar Medicamento                                 │  │
│   │                                                          │  │
│   │ [Salvar e Finalizar] [Cancelar]                        │  │
│   └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │ POST /api/atendimentos/{id}/registrar
                     │ {
                     │   status: "REALIZADO",
                     │   data_realizacao: now(),
                     │   prontuario: {...},
                     │   prescricoes: [...]
                     │ }
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│        BACKEND - AtendimentoService                               │
│                                                                   │
│  1. Validar permissões                                            │
│     - Apenas prof logado pode registrar seu atendimento           │
│                                                                   │
│  2. Atualizar atendimento                                         │
│     UPDATE atendimento SET                                        │
│       status = 'REALIZADO',                                       │
│       data_realizacao = NOW()                                     │
│                                                                   │
│  3. Criar prontuário_atendimento                                  │
│                                                                   │
│  4. Criar prescrições (se houver)                                 │
│                                                                   │
│  5. Publicar evento: "AtendimentoRealizadoEvent"                  │
│     → Trigger para gerar pagamento                                │
│                                                                   │
│  6. Registrar auditoria                                           │
│     INSERT INTO auditoria_acesso (...)                            │
│                                                                   │
│  7. Retornar sucesso                                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│        FRONTEND - Mostrar confirmação                             │
│                                                                   │
│        ✅ Atendimento registrado com sucesso!                    │
│           Código: ATD-123456                                      │
│                                                                   │
│        [Voltar para Lista] [Gerar Receita] [Enviar para Paciente]│
└───────────────────────────────────────────────────────────────────┘

```

---

## 4️⃣ FLUXO DE CÁLCULO E GERAÇÃO DE PAGAMENTO

```
┌──────────────────────────────────────────────────────────────────┐
│         BACKEND - Job Agendado (Mensal, ex: 1º dia útil)        │
│              "Gerar Pagamentos do Mês"                            │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│      PagamentoService.gerarPagamentosMensais()                   │
│                                                                  │
│  1. Buscar todos os atendimentos realizados mês passado          │
│     SELECT * FROM atendimento                                    │
│     WHERE status = 'REALIZADO'                                   │
│     AND MONTH(data_realizacao) = ?                               │
│     AND YEAR(data_realizacao) = ?                                │
│                                                                  │
│  2. Agrupar por profissional                                     │
│     GROUP BY profissional_id                                     │
│                                                                  │
│  3. Para cada profissional:                                      │
│     a. Buscar tipo de pagamento configurado                      │
│     b. Acessar estratégia correta (Strategy Pattern)             │
│     c. Calcular valor bruto                                      │
│     d. Calcular desconto da clínica                              │
│     e. Calcular valor líquido                                    │
│                                                                  │
│  Exemplo de cálculo:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Profissional: Dr. João (Psicologia)                    │   │
│  │ Tipo de pagamento: AMBOS (Fixo + Percentual)          │   │
│  │                                                         │   │
│  │ Atendimentos do mês (junho/2026):                      │   │
│  │ - 20 atendimentos particulares @ R$ 150 = R$ 3.000    │   │
│  │ - 10 atendimentos com plano @ R$ 100 = R$ 1.000       │   │
│  │ - 5 atendimentos telemedicina @ R$ 80 = R$ 400        │   │
│  │                                                         │   │
│  │ Valor Bruto: R$ 4.400                                  │   │
│  │ Desconto clínica (20%): -R$ 880                        │   │
│  │ Valor Líquido: R$ 3.520                                │   │
│  │                                                         │   │
│  │ Status: PENDENTE (aguardando aprovação)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  4. Criar registro Pagamento                                     │
│     INSERT INTO pagamento (                                      │
│       profissional_id,                                           │
│       mes_referencia = '2026-06',                                │
│       valor_bruto = 4400.00,                                     │
│       desconto_clinica = 880.00,                                 │
│       valor_liquido = 3520.00,                                   │
│       status = 'PENDENTE'                                        │
│     )                                                            │
│                                                                  │
│  5. Criar detalhes de pagamento (Detalhe_Pagamento)             │
│     Para cada atendimento, registrar:                            │
│     - atendimento_id                                             │
│     - valor_atendimento                                          │
│     - tipo (PARTICULAR / COM_PLANO)                              │
│     - plano_saude_id (se aplicável)                              │
│     - percentual_cobertura                                       │
│                                                                  │
│  6. Publicar evento: "PagamentoGeradoEvent"                      │
│                                                                  │
│  7. Salvar log de auditoria                                      │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│  Pagamentos criados com status PENDENTE                          │
│  - Admin pode revisar antes de processar                         │
│  - Profissional pode visualizar em "Meus Pagamentos"             │
└──────────────────────────────────────────────────────────────────┘


PROCESSAMENTO DO PAGAMENTO
┌──────────────────────────────────────────────────────────────────┐
│  ADMIN aprova pagamento (após revisar)                           │
│  PATCH /api/pagamentos/{id}/processar                            │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│  Backend atualiza status para PROCESSANDO                        │
│  UPDATE pagamento SET status = 'PROCESSANDO' ...                 │
│                                                                  │
│  Integração com sistema bancário (futuro):                       │
│  - Conectar a TED/PIX                                            │
│  - Enviar dados bancários profissional                           │
│  - Transferência automática                                      │
│  - Webhook retorna confirmação                                   │
│                                                                  │
│  Se sucesso: status = 'PAGO'                                     │
│  Se falha: status = 'FALHOU' + mensagem de erro                  │
└──────────────────────────────────────────────────────────────────┘

```

---

## 5️⃣ FLUXO DE GERAÇÃO DE RELATÓRIO MENSAL

```
┌───────────────────────────────────────────────────────────────┐
│         PROFISSIONAL OU ADMIN                                  │
│      "Quero ver meu resumo de pagamentos"                      │
└────────────────────┬──────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────────┐
│   FRONTEND - Página de Relatórios                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Relatório de Pagamentos                                │ │
│  │                                                         │ │
│  │ Período: [Jun/2026 ▼]  [Jul/2026 ▼]                   │ │
│  │                                                         │ │
│  │ Profissional: [Todos ▼]                               │ │
│  │                                                         │ │
│  │ [Gerar Relatório] [Exportar PDF] [Exportar Excel]     │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────┬──────────────────────────────────────────┘
                     │ GET /api/relatorios/pagamentos
                     │     ?mes=06&ano=2026
                     │     &profissional_id=123 (opcional)
                     ▼
┌───────────────────────────────────────────────────────────────┐
│   BACKEND - RelatorioService                                  │
│                                                               │
│  1. Validar permissões                                        │
│     - ADMIN: pode ver todos                                   │
│     - PROFISSIONAL: apenas seus dados                         │
│                                                               │
│  2. Buscar pagamentos do período                              │
│     SELECT * FROM pagamento                                   │
│     WHERE mes_referencia = '2026-06'                          │
│     AND profissional_id = ?                                   │
│                                                               │
│  3. Montar relatório detalhado:                               │
│     {                                                         │
│       mes_referencia: "2026-06",                              │
│       profissional: {                                         │
│         id: 1,                                                │
│         nome: "Dr. João",                                     │
│         especialidade: "Psicologia"                           │
│       },                                                      │
│       resumo: {                                               │
│         total_atendimentos: 35,                               │
│         atendimentos_particular: 20,                          │
│         atendimentos_com_plano: 15,                           │
│         valor_bruto: 4400.00,                                 │
│         desconto_clinica: 880.00,                             │
│         valor_liquido: 3520.00,                               │
│         status_pagamento: "PENDENTE"                          │
│       },                                                      │
│       detalhes: [                                             │
│         {                                                     │
│           data_atendimento: "2026-06-02",                     │
│           paciente: "João Silva",                             │
│           tipo: "PARTICULAR",                                 │
│           valor: 150.00                                       │
│         },                                                    │
│         ...                                                   │
│       ],                                                      │
│       cancelamentos_faltas: 2                                 │
│     }                                                         │
│                                                               │
│  4. Registrar auditoria (relatorio foi visualizado)           │
│                                                               │
│  5. Retornar dados                                            │
└────────────────────┬──────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────────┐
│   FRONTEND - Exibir Relatório                                 │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗   │
│  ║         CLÍNICA ALLES - RELATÓRIO DE PAGAMENTO        ║   │
│  ║                  Junho/2026                           ║   │
│  ╠═══════════════════════════════════════════════════════╣   │
│  ║ Profissional: Dr. João | Especialidade: Psicologia   ║   │
│  ╠═══════════════════════════════════════════════════════╣   │
│  ║                                                       ║   │
│  ║ RESUMO EXECUTIVO                                      ║   │
│  ║ ─────────────────────────────────────────────────────  ║   │
│  ║ Total de Atendimentos ............ 35                 ║   │
│  ║   • Particular ................... 20                 ║   │
│  ║   • Com Plano .................... 15                 ║   │
│  ║ Cancelamentos/Faltas ............. 2                  ║   │
│  ║                                                       ║   │
│  ║ VALORES                                               ║   │
│  ║ ─────────────────────────────────────────────────────  ║   │
│  ║ Valor Bruto Gerado .............. R$ 4.400,00        ║   │
│  ║ Desconto Clínica (20%) .......... -R$ 880,00         ║   │
│  ║ ─────────────────────────────────────────────────────  ║   │
│  ║ VALOR A RECEBER ................. R$ 3.520,00        ║   │
│  ║                                                       ║   │
│  ║ Status: ⏳ PENDENTE (aguardando aprovação)            ║   │
│  ╚═══════════════════════════════════════════════════════╝   │
│                                                               │
│  [Exportar PDF] [Exportar Excel] [Voltar]                    │
└───────────────────────────────────────────────────────────────┘

EXPORT PARA PDF
│
├─ POST /api/relatorios/pagamentos/{id}/export-pdf
│   └─ Gera PDF e retorna arquivo
│
EXPORT PARA EXCEL
│
├─ POST /api/relatorios/pagamentos/{id}/export-excel
│   └─ Gera XLSX e retorna arquivo

```

---

## 6️⃣ FLUXO DE CANCELAMENTO DE ATENDIMENTO

```
┌────────────────────────────────────────────────────────┐
│  USUÁRIO (Paciente, Prof ou Recepcionista)             │
│  "Preciso cancelar um atendimento"                     │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│  Buscar atendimento agendado                           │
│  GET /api/atendimentos/{id}                            │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│  Frontend exibe dados:                                 │
│  - Paciente: João Silva                                │
│  - Data: 02/07/2026 14:00                              │
│  - Prof: Dr. João                                      │
│  - [Cancelar Agendamento]                              │
└────────────────────┬─────────────────────────────────┘
                     │ DELETE /api/atendimentos/{id}
                     │ ou PATCH com status CANCELADO
                     ▼
┌────────────────────────────────────────────────────────┐
│  Backend - Validar:                                    │
│                                                        │
│  1. Permissões (pode cancelar?)                        │
│  2. Status (é AGENDADO ou NAO_COMPARECEU?)             │
│  3. Timing (não cancelar atendimento em andamento)     │
└────────────────────┬─────────────────────────────────┘
         ┌───────────┴──────────┐
    ✅ OK           ❌ ERRO
         │                      │
         ▼                      ▼
    Update status        Return 400/403
    CANCELADO
         │
         ▼
    Publicar evento
    "AtendimentoCanceladoEvent"
         │
         ├─→ Remover do cálculo de pagamento (se aplicável)
         ├─→ Enviar notificação ao paciente
         ├─→ Enviar notificação ao profissional
         └─→ Registrar auditoria

```

---

## 7️⃣ REGRAS DE NEGÓCIO - RESUMO

### Agendamento
- ✅ Profissional deve estar ativo e ter especialidade
- ✅ Não pode agendar fora do horário profissional
- ✅ Não pode agendar com conflito de horários
- ✅ Se plano, plano deve estar ativo e vigente
- ✅ Plano deve cobrir a especialidade

### Atendimento
- ✅ Pode apenas ser registrado por profissional logado
- ✅ Apenas atendimentos AGENDADO ou NÃO_COMPARECEU podem mudar para REALIZADO
- ✅ Data de realização não pode ser no futuro

### Pagamento
- ✅ Somente atendimentos com status REALIZADO geram pagamento
- ✅ Atendimentos cancelados/não comparecidos NÃO geram pagamento
- ✅ Profissional com plano AMBOS: valor diferente para particular vs plano
- ✅ Pagamentos gerados mensalmente (via job)
- ✅ Desconto clínica aplicado sempre

### Acesso
- ✅ Paciente vê apenas seus atendimentos
- ✅ Profissional vê seus atendimentos
- ✅ Admin vê todos
- ✅ Dados bancários: profissional vê apenas seus, admin vê todos

