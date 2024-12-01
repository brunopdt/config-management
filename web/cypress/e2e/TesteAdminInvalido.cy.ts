describe('Login Tests', () => {
  it('should display error message for invalid login', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('input[name="username"]').should('be.visible').type('invalidUser');
      cy.get('input[name="password"]').should('be.visible').type('invalidPassword');
      cy.get('button[type="submit"]').should('be.visible').click();
      cy.get('.css-1hbmzt3-MuiGrid-root').should('be.visible')
  });
});