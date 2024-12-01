describe('Teste de login', () => {
  it('Carrega a página de login e realiza o login', () => {
    cy.viewport(1920, 1080)

    // Carrega a página localhost
    cy.visit('http://localhost:5173/login');

    // Verifica se os dois inputs estão na tela
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');

    // Digita "admin" no primeiro input
    cy.get('input[name="username"]').type('teste@gmail.com');

    // Digita "admin" no segundo input
    cy.get('input[name="password"]').type('teste');

    // Verifica se o botão de login existe e clica nele
    cy.get('button[type="submit"]').should('exist').click();

    // Verifica se foi redirecionado para outra página (você pode ajustar esse seletor conforme a página que deseja verificar)
    cy.url().should('include', '/');

    cy.get('.css-1t6c9ts > :nth-child(1)').should('exist').click()

    // Agora, na nova tela, localizamos os três inputs e digitamos os valores fornecidos
    cy.get('[name="evento"]').should('exist').type('Festa');
    cy.get('input[name="Latitude"]').should('exist').type(19.933792246928522);
    cy.get('input[name="Longitude"]').should('exist').type(43.935669960376345);

    cy.intercept('GET', 'http://localhost:3000/events').as('getData')
    
    // Por último, clicamos no botão de cadastrar local
    cy.get('.MuiGrid-grid-md-5 > .MuiButtonBase-root').should('exist').click()
    cy.wait(3000)

    cy.get('.css-1dr59fg > .MuiGrid-container > .MuiGrid-root').should('be.visible')

    cy.get('.css-1t6c9ts > :nth-child(2)').should('exist').click()

    cy.get('.MuiGrid-grid-md-5 > :nth-child(3)').should('exist').type('Festão');

    cy.get('.MuiGrid-grid-md-5 > :nth-child(5)').should('exist').type('2024-05-20')

    cy.get('.MuiGrid-grid-md-5 > :nth-child(7)').should('exist').type('01:00');

    cy.get('.MuiGrid-grid-md-5 > .MuiButton-root').should('exist').click()

    cy.get('.css-1t6c9ts > :nth-child(3)').should('exist').click()

    cy.get('.css-1deu0ey-MuiGrid-root > :nth-child(1) > .MuiGrid-root').should('be.visible')

    cy.get(':nth-child(2) > .MuiGrid-root > .MuiBox-root').should('be.visible')

    cy.get(':nth-child(3) > .MuiGrid-root').should('be.visible')

    cy.get('.css-11lq3yg-MuiGrid-root > :nth-child(1) > .MuiGrid-item').should('be.visible')

    cy.get('.css-11lq3yg-MuiGrid-root > :nth-child(2) > .MuiGrid-item').should('be.visible')


  });
});