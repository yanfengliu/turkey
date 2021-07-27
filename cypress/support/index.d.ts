declare namespace Cypress {
  interface Chainable {
    matchImageSnapshot(arg0: string);

    /**
     * Custom command to get element by its `data-testid`
     * @example cy.getById('delete_button')
     */
    getById(testid: string): Chainable;
  }
}
