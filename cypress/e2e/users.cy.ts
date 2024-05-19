import '@testing-library/cypress/add-commands';
import { UserRoleType } from '@/types/User';
import { fillUserForm } from '../utils/users';
import { mockCreateUser, mockUsers } from '../mocks/users';
import { defaultUserArray } from '../fixtures/users';

describe('Users API', () => {
  beforeEach(() => {
    cy.setSession();
    cy.visit('/users');
    mockUsers();
  });

  it('should add user', () => {
    cy.findByTestId('addUser').click();
    fillUserForm('test', 'user', 'wrong@test.com', 'ddd#D', 'User');
    mockCreateUser();

    cy.findByTestId('addUserSubmit').click();
    const newUser = {
      firstName: 'test',
      lastName: 'user',
      email: 'wrong@test.com',
      password: 'ddd#D',
      role: UserRoleType.USER,
      id: '',
      iconColor: '',
      editMode: false,
      createUserError: '',
    };
    cy.wait('@createUser').its('request.body').should('be.deep.equal', newUser);

    const updatedUserList = [...defaultUserArray, newUser];
    mockUsers(updatedUserList);
    cy.visit('/users');
    cy.get('.MuiDataGrid-virtualScroller').scrollTo('bottom');
    cy.contains('wrong@test.com').should('be.visible');
  });

  it('Should display validation errors if fields are empty and submit is clicked', () => {
    cy.findByTestId('addUser').click();
    cy.findByTestId('addUserSubmit').click();
    cy.findByText('First name is required');
    cy.findByText('Password is required');
  });

  it('should cancel adding user', () => {
    cy.findByTestId('addUser').click();
    cy.findByTestId('cancelUserSubmit').click();
    cy.findByText('Add new user').should('not.exist');
  });

  it('Should display validation error if user exists', () => {
    cy.intercept('POST', '**/users/createUser*', {
      statusCode: 400,
      body: { message: 'User already exists' },
    }).as('userExists');
    cy.findByTestId('addUser').click();
    fillUserForm('Alice', 'Smith', 'alice@example.com', 'ddd#D', 'User');

    cy.findByTestId('addUserSubmit').click();

    cy.findByText('User already exists').should('be.visible');
  });

  it('should handle the deletion of selected users', () => {
    cy.intercept('DELETE', '**/users/deleteAllUsers*', req => {
      req.reply({
        body: {
          success: true,
          message: 'User deleted successfully',
        },
      });
    }).as('deleteUser');
    cy.get('.MuiDataGrid-cellCheckbox').first().find('input[type="checkbox"]').click();
    cy.findByTestId('deleteUsers').click();
    cy.findByTestId('deleteModalAllUsers').click();

    cy.wait('@deleteUser').then(() => {
      mockUsers([]);
      cy.visit('/users');
      cy.findByText('john@example.com').should('not.exist');
    });
  });

  it('should handle user deletion', () => {
    cy.intercept('DELETE', '**/users/deleteUser*', req => {
      req.reply({
        body: {
          success: true,
          message: 'User deleted successfully',
        },
      });
    }).as('deleteSingleUser');
    cy.findByTestId(`deleteUser-2`).within(() => {
      cy.findByTestId('DeleteIcon').click();
    });
    cy.findAllByTestId('deleteModalUser2').click({ force: true });
    cy.wait('@deleteSingleUser').then(() => {
      const updatedUsers = defaultUserArray.filter(user => user.id !== '2');
      mockUsers(updatedUsers);
      cy.visit('/users');
      cy.findByText('alice@example.com').should('not.exist');
    });
  });

  it('should update user', () => {
    cy.findByTestId(`updateUser-2`).within(() => {
      cy.findByTestId('EditIcon').click({ force: true });
    });

    cy.findByTestId('firstName').clear().type('newTest');
    cy.findByTestId('lastName').clear().type('newLast');
    cy.findByTestId('role-select').click();
    cy.get('ul.MuiList-root').contains('Admin').click();

    cy.intercept('PUT', '**/users/updateUser*', req => {
      req.reply({
        body: {
          firstName: 'newTest',
          lastName: 'newLast',
          role: 'Admin',
        },
      });
    }).as('updateUser');

    cy.findByTestId('addUserSubmit').click();

    const updatedUser = {
      firstName: 'newTest',
      lastName: 'newLast',
      email: 'alice@example.com',
      password: 'ddd#D',
      role: UserRoleType.ADMIN,
      id: '2',
      iconColor: '#00ff00',
      editMode: true,
      createUserError: '',
    };
    cy.wait('@updateUser').its('request.body').should('be.deep.equal', updatedUser);

    const indexOfUpdatedUser = defaultUserArray.findIndex(user => user.id === '2');
    if (indexOfUpdatedUser !== -1) {
      defaultUserArray[indexOfUpdatedUser] = updatedUser;
    } else {
    }
    mockUsers(defaultUserArray);
    cy.visit('/users');
    cy.findByText('newTest').should('exist');
  });

  it('should allow changing languages', () => {
    cy.findByTestId('headerLanguage').find('.MuiSelect-select').click();
    cy.get('ul.MuiList-root').contains('li', 'Ua').click();

    cy.findByTestId('headerLanguage').find('.MuiSelect-select').click();
    cy.get('ul.MuiList-root').contains('li', 'En').click();
    cy.contains('Users').should('be.visible');
  });

  it('should display message when no search results are found', () => {
    cy.intercept('GET', '**/users/getAllUsers*').as('searchUsers');
    cy.findByTestId('searchInput').click({ force: true }).type('some random');

    cy.wait('@searchUsers');

    cy.url().should('include', 'search=some+random');
  });

  it('should correctly sort users by first name in descending order', () => {
    cy.intercept('GET', '**/users/getAllUsers*').as('sortUsers');
    cy.get('[data-field="firstName"]').findByTestId('ArrowUpwardIcon').click({ force: true });
    cy.wait('@sortUsers').then(() => {
      cy.url().should('include', 'sort=firstName');
    });
  });

  it('should filter users by role', () => {
    cy.intercept('GET', '**/users/getAllUsers*').as('filterUsers');

    cy.findByTestId('filterUsers').find('.MuiSelect-select').click();
    cy.findByTestId('checkbox-user').click();
    cy.findByTestId('applyFilterButton').click();

    cy.wait('@filterUsers');
    cy.url().should('include', 'filter=role%3Duser');
  });

  it('should navigate to the next page of users', () => {
    cy.intercept('GET', '**/users/getAllUsers*').as('nextPage');

    cy.get('.MuiTablePagination-actions').findAllByLabelText('Go to next page').click();
    cy.wait('@nextPage');
    cy.url().should('include', 'skip=5');
  });

  it('should increase limit of users', () => {
    cy.intercept('GET', '**/users/getAllUsers*').as('increaseLimit');

    cy.get('.MuiTablePagination-root').find('.MuiSelect-select').click({ force: true });
    cy.contains('li', '9').should('have.attr', 'data-value', '9').click();
    cy.wait('@increaseLimit');
    cy.url().should('include', 'limit=9');
  });
});
