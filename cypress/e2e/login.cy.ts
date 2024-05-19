import '@testing-library/cypress/add-commands';
import { generateMockToken } from '../support/tokenUtils';

describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should login successfully and receive a JWT', () => {
    const mockToken = generateMockToken();

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: mockToken,
        user: {
          role: 'superAdmin',
          _id: 'dd',
          email: 'admin@test1.com',
          iconColor: 'red',
          firstName: 'test',
          lastName: 'tset',
        },
      },
    }).as('login');

    cy.visit('/login');
    cy.findByTestId('emailInput').type('admin@test.com');
    cy.findByTestId('passwordInput').type('test');
    cy.findByTestId('buttonSubmit').click();
    cy.url().should('include', '/');
    window.localStorage.setItem('token', mockToken);
    cy.wait('@login');
  });

  it('Should show an error for incorrect login credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('failedLogin');

    cy.findByTestId('emailInput').type('wrong@test.com');
    cy.findByTestId('passwordInput').type('wrongpassword');
    cy.findByTestId('buttonSubmit').click({ force: true });

    cy.wait('@failedLogin');
  });

  it('Should display validation errors if fields are empty and submit is clicked', () => {
    cy.findByTestId('buttonSubmit').click();
    cy.findByText('Email is required');
    cy.findByText('Password is required');
  });

  it('should allow changing languages by selecting from the dropdown', () => {
    cy.get('.MuiSelect-select').click();
    cy.get('ul.MuiList-root').contains('li', 'Ua').click();
    cy.contains('Увійти').should('be.visible');

    cy.get('.MuiSelect-select').click();
    cy.get('ul.MuiList-root').contains('li', 'En').click();
    cy.contains('Sign In').should('be.visible');
  });
});
