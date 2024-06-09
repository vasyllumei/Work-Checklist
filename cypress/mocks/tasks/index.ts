import { TaskType } from '@/types/Task';
import { defaultTaskArray } from '../../fixtures/tasks';

export function mockTasks(projectId: string, customTasks: TaskType[] | null = null) {
  const tasks = customTasks || defaultTaskArray;

  cy.intercept('GET', `**/tasks/getAllTasks?projectId=${projectId}`, {
    data: tasks,
  }).as('tasks');
}
