import React, { useEffect } from 'react';
import { ProjectType } from '@/types/Project';
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
  updateActiveProject,
} from '@/services/project/projectService';
import styles from './ProjectsList.module.css';
import { useFormik } from 'formik';
import AddIcon from './../../assets/image/menuicon/addIcon.svg';
import { CreateProjectModal } from '@/components/ProjectList/components/modals/CreateProjectModal/CreateProjectModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import { setActiveProject, setProjects } from '@/store/projectStore/projectReducer/projectReducers';
import { useDialogControl } from '@/hooks/useDialogControl';
import { projectValidationSchema } from '@/components/ProjectList/utils';
import { Project } from '@/components/ProjectList/components/Project';

const initialProjectForm = {
  id: '',
  title: '',
  description: '',
  active: false,
  color: '',
  editMode: false,
  createProjectError: '',
};

export const ProjectsList = () => {
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const { isOpen: isDialogOpen, openDialog: openProjectDialog, closeDialog: closeProjectDialog } = useDialogControl();

  const formik = useFormik({
    initialValues: initialProjectForm,
    validationSchema: projectValidationSchema,
    onSubmit: async () => {
      try {
        if (formik.values.id) {
          await handleSaveUpdatedProject();
        } else {
          await handleProjectCreate();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const fetchProjectData = async () => {
    try {
      const { data: projectsData } = await getAllProjects();
      dispatch(setProjects(projectsData));
      setInitialActiveProject(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectCreate = async () => {
    try {
      await createProject(formik.values);
      await fetchProjectData();
      handleDialogClose();
    } catch (error: any) {
      if (error.response?.data?.message) {
        formik.setErrors({ createProjectError: error.response.data.message });
      }
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      await fetchProjectData();
    } catch (error) {
      console.error('Error deleting projectId:', error);
    }
  };

  const handleProjectEdit = (projectId: string) => {
    try {
      const projectData = projects.find(project => project.id === projectId);
      if (projectData) {
        formik.setValues({ ...initialProjectForm, ...projectData, editMode: true });
        openProjectDialog();
      }
    } catch (error) {
      console.error('Error updating the user', error);
    }
  };

  const handleSaveUpdatedProject = async () => {
    try {
      await updateProject(formik.values.id, formik.values);
      await fetchProjectData();
      handleDialogClose();
    } catch (error) {
      console.error('Error updating projectId:', error);
    }
  };

  const handleProjectToggleActive = async (projectId: string) => {
    try {
      const currentActiveProject = projects.find(project => project.active);

      if (currentActiveProject?.id === projectId) {
        await updateActiveProject('');
        dispatch(setActiveProject(''));
      } else {
        await updateActiveProject(projectId);
        dispatch(setActiveProject(projectId));
      }
    } catch (error) {
      console.error('Error updating projectId:', error);
    }
  };

  const setInitialActiveProject = (projects: ProjectType[]) => {
    const activeProject = projects.find(project => project.active);
    if (activeProject) {
      dispatch(setActiveProject(activeProject.id));
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleDialogOpen = () => {
    formik.setValues(initialProjectForm);
    openProjectDialog();
  };

  const handleDialogClose = () => {
    closeProjectDialog();
    formik.resetForm();
  };

  return (
    <div>
      <hr className={styles.lineDivider} />
      <CreateProjectModal
        formik={formik}
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        isEditMode={formik.values.editMode}
      />
      <div className={styles.projectTitleColumn}>
        <h2 className={styles.projectMainTitle}>Projects</h2>
        <AddIcon className={styles.projectAdd} onClick={handleDialogOpen} data-testid="addProject" />
      </div>
      <div className={styles.projectListContainer}>
        {projects.map((project: ProjectType) =>
          project?.title ? (
            <Project
              dataTestId="projectItem"
              key={project.id}
              project={project}
              onEdit={handleProjectEdit}
              onDelete={handleProjectDelete}
              onToggleActive={handleProjectToggleActive}
            />
          ) : null,
        )}
      </div>
    </div>
  );
};
