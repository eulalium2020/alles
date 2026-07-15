describe('Auth flow', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('/dashboard')
    cy.location('pathname').should('eq', '/login')
  })

  it('logs in and navigates to dashboard', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'aa.eyJleHAiOjQxMDI0NDQ4MDB9.bb',
        refreshToken: 'refresh-token',
        usuario: {
          id: 1,
          nome: 'Admin Alles',
          email: 'admin@alles.com',
          cpf: '12345678901',
          telefone: '11999999999',
          perfil: 'ADMIN',
          ativo: true,
          criadoEm: '2026-07-01T10:00:00',
          atualizadoEm: '2026-07-01T10:00:00',
        },
      },
    }).as('loginRequest')

    cy.visit('/login')
    cy.get('#email').type('admin@alles.com')
    cy.get('#password').type('senha123')
    cy.contains('button', 'Entrar').click()

    cy.wait('@loginRequest')
    cy.location('pathname').should('eq', '/dashboard')
  })
})
