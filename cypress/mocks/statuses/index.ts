import { defaultStatusArray } from '../../fixtures/statuses';
import { ColumnType } from '@/types/Column';

export function mockStatuses(customStatuses: ColumnType[] | null = null) {
  const statuses = customStatuses || defaultStatusArray;

  cy.intercept('GET', '**/statuses/getAllStatuses*', {
    data: statuses,
  }).as('statuses');
}
export const mockCreateStatus = () => {
  cy.intercept('POST', '**/statuses/createStatus*', req => {
    const { title } = req.body;

    const newStatus = {
      title,
    };
    req.reply({ statusCode: 201, body: { status: newStatus } });
  }).as('createStatus');
};
