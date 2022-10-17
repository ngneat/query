describe('basic page', () => {
  beforeEach(() => cy.visit('/basic'));

  it('should display todos in list group', () => {
    cy.get('.list-group')
      .children()
      .each((el, index) => {
        expect(el.text().trim()).to.equal(`Todo-${index}`);
      });
  });

  it('should fetch single todos only once', () => {
    cy.get('#single-todo-card').contains('100');
    cy.intercept('GET', '/todos/*').as('todo');
    cy.get('#todo-btns-section button:nth-child(1)').click();
    cy.get('#todo-btns-section button:nth-child(2)').click();
    cy.get('#single-todo-card').contains('101');
    cy.get('#todo-btns-section button:nth-child(3)').click();
    cy.get('#single-todo-card').contains('102');
    cy.get('#todo-btns-section button:nth-child(1)').click();
    cy.get('#todo-btns-section button:nth-child(2)').click();
    cy.get('#todo-btns-section button:nth-child(3)').click();

    cy.get('@todo.all').should('have.length', 2);
  });

  it('should fetch single todos only once', () => {
    cy.intercept('POST', '/todos').as('todos');

    cy.get('#add-todo-1').click();
    cy.wait('@todos');
    cy.get('#add-todo-2').click();
    cy.wait('@todos');

    cy.get('@todos.all').should('have.length', 2);
  });
});
