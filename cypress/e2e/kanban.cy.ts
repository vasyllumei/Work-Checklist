import '@testing-library/cypress/add-commands';
import { mockUsers } from '../mocks/users';
import { mockTasks } from '../mocks/tasks';
import { mockCreateStatus, mockStatuses } from '../mocks/statuses';
import { interceptUpdateActiveProject, mockCreateProject, mockProjects } from '../mocks/projects';
import { defaultProjectArray } from '../fixtures/projects';
import { defaultStatusArray } from '../fixtures/statuses';

describe('Kanban page test', () => {
  beforeEach(() => {
    cy.setSession();
    cy.visit('/kanban');
    mockProjects();
    mockStatuses();
    mockTasks('1p');
    mockUsers();
    interceptUpdateActiveProject('updateActiveProject');
  });

  it('Should activate project', () => {
    cy.findByTestId('projectItem-1p').click();
    cy.wait(100);
    cy.wait('@updateActiveProject').its('request.body').should('deep.equal', {
      projectId: '1p',
    });
    cy.findByText('testTask');
  });

  it('Should deactivated project', () => {
    interceptUpdateActiveProject('updateActiveProject');
    cy.findByTestId('projectItem-1p').click();
    cy.wait('@updateActiveProject').its('request.body').should('deep.equal', {
      projectId: '1p',
    });
    interceptUpdateActiveProject('deactivateProject');
    cy.findByTestId('projectItem-1p').click();
    cy.wait('@deactivateProject').its('request.body').should('deep.equal', {
      projectId: '',
    });
  });

  it('Should edit project', () => {
    cy.findByTestId('projectItem-1p').click().findByTestId('projectItem-menuButton-1p-button').click();
    cy.get('ul[role="menu"]').should('be.visible');
    cy.findByTestId('projectItem-menuButton-1p-edit').should('be.visible').click();
    cy.findByTestId('title-input').clear().type('someName');
    cy.intercept('PUT', '**/projects/updateProject*', req => {
      req.reply({
        body: {
          title: 'someName',
        },
      });
    }).as('updateProject');
    cy.findByTestId('addProjectSubmit').click();
    const updatedProject = {
      id: '1p',
      title: 'someName',
      description: '<p>dd</p>',
      active: true,
      color: '#3f51b5',
      createProjectError: '',
      editMode: true,
    };
    cy.wait('@updateProject').its('request.body').should('be.deep.equal', updatedProject);
    const indexOfUpdatedProject = defaultProjectArray.findIndex(project => project.id === '1p');
    if (indexOfUpdatedProject !== -1) {
      defaultProjectArray[indexOfUpdatedProject] = updatedProject;
    } else {
    }
    mockProjects(defaultProjectArray);
    cy.visit('/kanban');
    cy.findByTestId('projectItem-1p').should('contain.text', 'someName');
  });

  it('Should cancel project editing', () => {
    cy.findByTestId('projectItem-menuButton-1p-button').should('exist').should('be.visible').click();
    cy.get('ul[role="menu"]').should('be.visible');
    cy.findByTestId('projectItem-menuButton-1p-edit').should('exist').should('be.visible').click();
    cy.findByTestId('cancelProjectSubmit').should('exist').should('be.visible').click();
    cy.visit('/kanban');
    cy.findByTestId('projectItem-1p').should('contain.text', 'someName');
  });

  it('should handle project deletion', () => {
    cy.intercept('DELETE', '**/projects/deleteProject*', req => {
      req.reply({
        body: {
          success: true,
          message: 'Project deleted successfully',
        },
      });
    }).as('deleteProject');
    cy.findByTestId('projectItem-menuButton-1p-button').should('exist').should('be.visible').click();
    cy.get('ul[role="menu"]').should('be.visible');
    cy.findByTestId('projectItem-menuButton-1p-delete').should('exist').should('be.visible').click();
    cy.findAllByTestId('deleteModalprojectItem-menuButton-1p').click({ force: true });
    cy.wait('@deleteProject').then(() => {
      const updatedProjects = defaultProjectArray.filter(project => project.id !== '1p');
      mockProjects(updatedProjects);
      cy.visit('/kanban');
      cy.findByText('someName').should('not.exist');
    });
  });

  it('Should create project', () => {
    cy.findByTestId('addProject').click();
    cy.findByTestId('title-input').clear().type('testName');
    cy.findByTestId('description-input').type('abc');
    cy.findByTestId('color-picker').findAllByTitle('#e91e63').click();
    mockCreateProject();
    cy.findByTestId('addProjectSubmit').click();

    const newProject = {
      id: '',
      title: 'testName',
      description: 'abc',
      active: false,
      editMode: false,
      color: '#e91e63',
      createProjectError: '',
    };
    cy.wait('@createProject').its('request.body').should('be.deep.equal', newProject);
    const updatedProjectList = [...defaultProjectArray, newProject];
    mockProjects(updatedProjectList);
    cy.visit('/kanban');
    cy.findByText('testName').should('contain.text', 'testName');
  });

  it('Should create status', () => {
    cy.findByTestId('addStatus').click();
    cy.findByTestId('statusModalInput').type('testStatusName');
    mockCreateStatus();
    cy.findByTestId('addStatusSubmit').click();

    const newStatus = {
      id: '',
      title: 'testStatusName',
      order: 0,
    };
    cy.wait('@createStatus').its('request.body').should('be.deep.equal', newStatus);
    const updatedStatusList = [...defaultStatusArray, newStatus];
    mockStatuses(updatedStatusList);
    cy.visit('/kanban');
    cy.findByTestId('projectItem-1p').click();
    cy.get('[data-rbd-droppable-id="mainContainer"]').findByTestId('column');
    cy.contains('testStatusName').should('be.visible');
  });

  it('should handle status delete', () => {
    cy.intercept('DELETE', '**/statuses/deleteStatus*', req => {
      req.reply({
        body: {
          success: true,
          message: 'Status deleted successfully',
        },
      });
    }).as('deleteStatus');
    cy.findByTestId('column2s').findByTestId('DeleteIcon').click();
    cy.findByTestId('deleteModalColumn').click({ force: true });
    cy.wait('@deleteStatus').then(() => {
      const updatedStatuses = defaultStatusArray.filter(status => status.id !== '2s');
      mockStatuses(updatedStatuses);
      cy.visit('/kanban');
      cy.findByTestId('projectItem-1p').click();
      cy.findByText('In Progress').should('not.exist');
    });
  });
});
