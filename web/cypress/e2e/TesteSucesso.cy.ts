describe('Teste de login', () => {
  it('Carrega a página de login e realiza o login', () => {
    cy.viewport(1920, 1080)

    // Carrega a página localhost
    cy.visit('http://localhost:5173/login')

    // Verifica se os dois inputs estão na tela
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')

    // Digita "admin" no primeiro input
    cy.get('input[name="username"]').type('cypress@cypress.com')

    // Digita "admin" no segundo input
    cy.get('input[name="password"]').type('cypress')

    // Verifica se o botão de login existe e clica nele
    cy.get('button[type="submit"]').should('exist').click()

    // Verifica se foi redirecionado para outra página (você pode ajustar esse seletor conforme a página que deseja verificar)
    cy.url().should('include', '/')

    cy.get('.css-1t6c9ts > :nth-child(1)').should('exist').click()
    cy.get('.css-1t6c9ts > :nth-child(2)').should('exist').click()
    cy.get('.css-1t6c9ts > :nth-child(3)').should('exist').click()
  })
})
