/**
 * 🏥 Healthcare Design System - Guia de Teste Visual Prático
 * 
 * Este arquivo documenta todos os testes que o usuário deve fazer no navegador
 * para validar que o design system está funcionando corretamente.
 */

export const visualTestGuide = {
  // ============================================================
  // SEÇÃO 1: VERIFICAÇÕES ANTES DE INICIAR TESTES
  // ============================================================
  
  preflightChecks: {
    description: 'Verificações antes de iniciar os testes',
    steps: [
      '1. Abrir DevTools (F12)',
      '2. Ir para Application > Local Storage',
      '3. Verificar se "theme" está salvo',
      '4. Se não estiver, clicar no botão 🌙 no canto inferior direito',
      '5. Verificar se "theme: light" ou "theme: dark" aparece',
      '6. Abrir Console e executar: designSystemTests.runTests()',
    ],
    expectedResults: [
      'localStorage tem chave "theme"',
      'DevTools mostra 8+ componentes refatorados',
      'Todos os testes passam',
    ],
  },

  // ============================================================
  // SEÇÃO 2: TESTES DE CORES
  // ============================================================
  
  colorTests: {
    description: 'Validar paleta de cores healthcare',
    location: 'Qualquer página autenticada',
    tests: [
      {
        name: 'Header Background',
        expected: 'Branco/cinza escuro (dark mode)',
        location: 'Topo da página',
        howToTest: 'Inspecionar Header com DevTools',
        status: 'visual',
      },
      {
        name: 'Primary Blue',
        expected: '#0A6992 em light, #4A90B8 em dark',
        location: 'Sidebar, botões primários, headings',
        howToTest: 'Clicar em botão primário e inspecionar cor',
        status: 'visual',
      },
      {
        name: 'Secondary Teal',
        expected: '#45B69C em light, #5DB89E em dark',
        location: 'Alguns botões secundários',
        howToTest: 'Procurar botão com cor teal e inspecionar',
        status: 'visual',
      },
      {
        name: 'Light Background',
        expected: '#F4F8FA em light, #1F2937 em dark',
        location: 'Background dos bodies das páginas',
        howToTest: 'Inspecionar corpo da página',
        status: 'visual',
      },
    ],
  },

  // ============================================================
  // SEÇÃO 3: TESTES DE COMPONENTES
  // ============================================================

  componentTests: {
    header: {
      name: 'Header Component',
      tests: [
        {
          action: 'Busca',
          test: 'Clicar na barra de busca',
          expected: 'Border azul + shadow + background #FAFBFF',
        },
        {
          action: 'Notificações',
          test: 'Hover no ícone 🔔',
          expected: 'Background var(--light-bg)',
        },
        {
          action: 'Menu Usuário',
          test: 'Hover no ícone ⌄',
          expected: 'Dropdown com estilos profissionais',
        },
      ],
    },

    sidebar: {
      name: 'Sidebar Navigation',
      tests: [
        {
          action: 'Item Ativo',
          test: 'Ir para Dashboard',
          expected: 'Item com background branco + sombra',
        },
        {
          action: 'Item Hover',
          test: 'Hover em Pacientes',
          expected: 'Background var(--light-bg) + texto branco',
        },
        {
          action: 'Submenu',
          test: 'Clicar em Pacientes',
          expected: 'Submenu expande com items indentados',
        },
      ],
    },

    cards: {
      name: 'Card Components',
      tests: [
        {
          action: 'StatCard Hover',
          test: 'Colocar mouse em um stat card (Ex: Dashboard)',
          expected: 'Card sobe (+4px) e sombra aumenta',
        },
        {
          action: 'InfoCard Styling',
          test: 'Procurar um InfoCard',
          expected: 'Bordas 1px solid var(--border-color), padding generoso',
        },
      ],
    },

    badges: {
      name: 'Status Badges',
      location: 'Listas (Atendimentos, Pacientes, etc)',
      tests: [
        {
          status: 'AGENDADO',
          expected: '#D6EAF8 bg + #1A5276 text + border azul',
        },
        {
          status: 'REALIZADO',
          expected: '#D5F4E6 bg + #0A5F3D text + border verde',
        },
        {
          status: 'CANCELADO',
          expected: '#FADBD8 bg + #78281F text + border vermelho',
        },
        {
          status: 'NAO_COMPARECEU',
          expected: '#FCF3CF bg + #7D6608 text + border amarelo',
        },
      ],
    },

    tables: {
      name: 'Table Lists',
      location: 'Pacientes, Profissionais, Atendimentos',
      tests: [
        {
          action: 'Header',
          expected: 'Background var(--light-bg), texto azul primário, font headings',
        },
        {
          action: 'Row Hover',
          test: 'Colocar mouse em uma linha',
          expected: 'Background muda para var(--light-bg)',
        },
        {
          action: 'Botões Ação',
          expected: 'Editar (azul) → Hover #084A6E + sombra + translate(-2px)',
        },
        {
          action: 'Paginação',
          expected: 'Botão ativo: azul primário, inativo: border + hover light-bg',
        },
      ],
    },
  },

  // ============================================================
  // SEÇÃO 4: TESTES DE INTERATIVIDADE
  // ============================================================

  interactivityTests: {
    transitions: {
      description: 'Verificar suavidade das transições (0.2s)',
      tests: [
        'Clicar em botões: devem ter transição suave',
        'Hover em cards: devem levantar suavemente',
        'Focus em inputs: devem mudar cor suavemente',
      ],
    },

    hoverEffects: {
      description: 'Verificar hover states em todos elementos',
      tests: [
        'Botões: translateY(-2px) + shadow aumenta',
        'Cards: shadow muda, transform aplicado',
        'Links/Badges: visual change sutilmente',
      ],
    },

    focusStates: {
      description: 'Verificar focus em formulários',
      tests: [
        'Inputs: border azul + shadow + fundo #FAFBFF',
        'Textareas: mesmos efeitos que inputs',
        'Selects: border azul + shadow',
      ],
    },
  },

  // ============================================================
  // SEÇÃO 5: TESTES DE DARK MODE
  // ============================================================

  darkModeTests: {
    activation: {
      description: 'Ativar Dark Mode',
      steps: [
        '1. Clicar no botão 🌙 no canto inferior direito',
        '2. Interface inteira deve mudar para cores escuras',
        '3. Verificar localStorage: deve ter "theme: dark"',
        '4. Recarregar página (F5): deve manter dark mode',
      ],
    },

    colorChanges: {
      description: 'Verificar cores em Dark Mode',
      tests: [
        {
          element: 'Background',
          light: '#F4F8FA',
          dark: '#1F2937',
          test: 'Inspecionar html ou body',
        },
        {
          element: 'Texto',
          light: '#2C3E50',
          dark: '#E5E7EB',
          test: 'Selecionar texto e inspecionar cor',
        },
        {
          element: 'Sidebar',
          light: 'Gradiente azul',
          dark: 'Gradiente azul mais escuro',
          test: 'Comparar cores',
        },
      ],
    },

    readability: {
      description: 'Verificar legibilidade em Dark Mode',
      tests: [
        'Todos os textos devem ser legíveis',
        'Contraste deve estar bom (≥4.5:1)',
        'Badges devem ter cores apropriadas',
        'Inputs devem ter fundo escuro mas texto legível',
      ],
    },
  },

  // ============================================================
  // SEÇÃO 6: TESTES DE RESPONSIVIDADE
  // ============================================================

  responsivityTests: {
    mobile: {
      description: 'Testar em tamanho mobile (< 768px)',
      steps: [
        '1. Abrir DevTools (F12)',
        '2. Clicar em "Toggle device toolbar" (Ctrl+Shift+M)',
        '3. Selecionar iPhone 12 (390x844)',
      ],
      tests: [
        'Sidebar: deve aparecer toggle button (☰)',
        'Header: busca deve ocupar espaço adequado',
        'Tabelas: devem fazer scroll horizontal',
        'Botões: devem ter tamanho tátil (≥44px)',
      ],
    },

    tablet: {
      description: 'Testar em tamanho tablet (768px)',
      steps: [
        '1. Usar "Toggle device toolbar" (Ctrl+Shift+M)',
        '2. Selecionar iPad (768x1024)',
      ],
      tests: [
        'Layout deve se adaptar bem',
        'Sidebar: deve estar visível',
        'Tabelas: devem ter paginação funcional',
      ],
    },

    desktop: {
      description: 'Testar em desktop (> 1024px)',
      tests: [
        'Sidebar: sempre visível',
        'Header: completo com busca + notificações',
        'Tabelas: sem scroll horizontal',
        'Espaçamento: deve ser generoso',
      ],
    },
  },

  // ============================================================
  // SEÇÃO 7: TESTES DE FORMS (PENDENTES)
  // ============================================================

  formTests: {
    status: 'PENDENTE - Refactoring em progresso',
    components: [
      'PacienteForm.tsx',
      'ProfissionalForm.tsx',
      'AtendimentoForm.tsx',
      'EspecialidadeForm.tsx',
      'PlanoSaudeForm.tsx',
    ],
    expectedAfterRefactor: [
      'Formulários com novo design healthcare',
      'Inputs com focus states azuis',
      'Seções com headings destacadas',
      'Mensagens de erro em red banner',
      'Botões com hover effects',
      'Grid layout responsivo',
      'Dark mode funcional',
    ],
  },

  // ============================================================
  // CHECKLIST FINAL
  // ============================================================

  finalChecklist: {
    visual: [
      '☐ Cores healthcare aplicadas',
      '☐ Tipografia correta (Open Sans + Montserrat)',
      '☐ Spacing consistente',
      '☐ Border radius 4px',
      '☐ Sombras suaves',
    ],

    interactive: [
      '☐ Transições 0.2s suaves',
      '☐ Hover effects em botões',
      '☐ Focus states em inputs',
      '☐ Cards levantam ao hover',
      '☐ Paginação funcional',
    ],

    darkMode: [
      '☐ Toggle button funciona',
      '☐ Cores mudam em dark mode',
      '☐ Texto legível em dark',
      '☐ localStorage persiste tema',
      '☐ Recarregar mantém tema',
    ],

    responsive: [
      '☐ Mobile <768px funciona',
      '☐ Tablet 768-1024px funciona',
      '☐ Desktop >1024px funciona',
      '☐ Sem quebras de layout',
      '☐ Touch targets adequados',
    ],
  },

  // ============================================================
  // COMO USAR ESTE GUIA
  // ============================================================

  instructions: `
    1. ABRIR NAVEGADOR
       - Acessar http://localhost:5173
       - Login com credenciais de teste
    
    2. EXECUTAR PREFLIGHT CHECKS
       - Abrir DevTools (F12)
       - Verificar localStorage
       - Executar: designSystemTests.runTests()
    
    3. TESTAR CORES
       - Percorrer todas as páginas
       - Inspecionar cores com DevTools
       - Comparar com valores esperados
    
    4. TESTAR COMPONENTES
       - Header: busca, notificações, menu
       - Sidebar: navegação, submenus
       - Cards: hovering, styling
       - Badges: cores por status
       - Tables: headers, rows, paginação
    
    5. TESTAR INTERATIVIDADE
       - Clicar em botões: deve haver transição
       - Hover em cards: deve haver transform
       - Focus em inputs: deve haver shadow
    
    6. TESTAR DARK MODE
       - Clicar no botão 🌙
       - Interface deve ficar escura
       - Recarregar página: deve manter dark
    
    7. TESTAR RESPONSIVIDADE
       - DevTools > Toggle device toolbar
       - Testar mobile (390px), tablet (768px), desktop (1920px)
       - Verificar se layout se adapta
    
    8. CHECKLIST FINAL
       - Marcar todos os ☐ conforme completa
       - Tomar screenshots para documentação
       - Relatar qualquer problema
  `,
}

// Exportar para uso em testes
export default visualTestGuide
