import { ProjectType } from '@/types/Project';
import { defaultProjectArray } from '../../fixtures/projects';

export const mockCreateProject = () => {
  cy.intercept('POST', '**/projects/createProject*', req => {
    const { title, description, active, color } = req.body;

    const newProject = {
      title,
      description,
      active,
      color,
    };
    req.reply({ statusCode: 201, body: { project: newProject } });
  }).as('createProject');
};
export function mockProjects(customProjects: ProjectType[] | null = null) {
  const projects = customProjects || defaultProjectArray;

  cy.intercept('GET', '**/projects/getAllProjects*', {
    data: projects,
  }).as('projects');
}

export const interceptUpdateActiveProject = (alias: string) => {
  cy.intercept('PATCH', '**/projects/updateActiveProject*', req => {
    req.reply({
      body: {
        message: 'Active projectId updated',
      },
    });
  }).as(alias);
};
