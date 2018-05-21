describe('Registration', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:3003/testing/reset-db')
  })

  it('Can register', () => {
    cy.visit('/register')
    cy
      .get('input[name="backend"]')
      .clear()
      .type('http://localhost:3003')
    cy
      .get('input[name="email"]')
      .clear()
      .type('harold@example.com')
    cy
      .get('input[name="password"]')
      .clear()
      .type('12345678')
    cy
      .get('input[name="confirm-password"]')
      .clear()
      .type('12345678')
    cy.get('button[type="submit"]').click()

    cy.get('[data-testid="logout"]').should('be.visible')
  })
})
