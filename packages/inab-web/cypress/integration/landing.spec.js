describe('Landing page', () => {
  it('Has a correct title', () => {
    cy.visit('/')
    cy.title().should('eq', 'INAB')
  })
})
