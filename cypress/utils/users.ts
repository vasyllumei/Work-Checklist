export function fillUserForm(firstName: string, lastName: string, email: string, password: string, role: string) {
  cy.findByTestId('firstName').type(firstName);
  cy.findByTestId('lastName').type(lastName);
  cy.findByTestId('email').type(email);
  cy.findByTestId('password').type(password);
  cy.findByTestId('modalActionsButtons').click();
  cy.findByTestId('role-select').contains(role).click();
  cy.get('ul.MuiList-root').contains(role).click();
}
