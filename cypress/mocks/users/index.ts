import { UserType } from '@/types/User';
import { defaultUserArray } from '../../fixtures/users';

export const mockCreateUser = () => {
  cy.intercept('POST', '**/users/createUser*', req => {
    const { firstName, lastName, email, role } = req.body;

    const newUser = {
      firstName,
      lastName,
      email,
      password: 'hashedPassword',
      role,
      iconColor: 'randomColor',
    };

    req.reply({ statusCode: 201, body: { user: newUser } });
  }).as('createUser');
};

export function mockUsers(customUsers: UserType[] | null = null) {
  const users = customUsers || defaultUserArray;
  const formattedDataWithMetaData = {
    data: users,
    totalCount: users.length,
    totalPages: Math.ceil(users.length / 5),
  };

  cy.intercept('GET', '**/users/getAllUsers*', {
    body: formattedDataWithMetaData,
  }).as('users');
}
