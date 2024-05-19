// cypress/support/commands.ts
//test
import { generateMockToken } from './tokenUtils';

Cypress.Commands.add('setSession', () => {
  const mockToken = generateMockToken();

  cy.setCookie('token', mockToken);
  window.localStorage.setItem('token', mockToken);
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      user: {
        role: 'superAdmin',
        _id: 'dd',
        email: 'admin@test1.com',
        iconColor: 'red',
        firstName: 'test',
        lastName: 'tset',
      },
    }),
  );
});
