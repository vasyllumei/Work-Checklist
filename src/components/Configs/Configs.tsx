import { Layout } from '@/components/Layout';
import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { createProject, getAllProjects } from '@/services/project/projectService';
import { setProjects } from '@/store/projectStore/projectReducer/projectReducers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import { useFormik } from 'formik';
import { projectValidationSchema } from '@/components/ProjectList/utils';
import { useRouter } from 'next/router';
import { breadcrumbsConfig, projectsList, styleBox } from '@/components/Configs/utils';
import { ThemeProvider } from '@mui/system';
import { dataGridTheme } from '@/styles/dataGridTheme';

const initialProjectForm = {
  id: '',
  title: '',
  description: '',
  active: false,
  color: '',
  editMode: false,
  createProjectError: '',
};

export const Configs = () => {
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialProjectForm,
    validationSchema: projectValidationSchema,
    onSubmit: async () => {
      try {
        await handleProjectCreate();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const fetchProjects = async () => {
    try {
      const { data: projectsData } = await getAllProjects();
      dispatch(setProjects(projectsData));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProjectCreate = async () => {
    try {
      await createProject(formik.values);
      await fetchProjects();
      formik.resetForm();
    } catch (error: any) {
      if (error.response?.data?.message) {
        formik.setErrors({ createProjectError: error.response.data.message });
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [dispatch]);

  const handleRowClick = (projectId: string) => {
    router.push(`/configs/${projectId}`);
  };

  return (
    <ThemeProvider theme={dataGridTheme}>
      <Layout headTitle="Configs" breadcrumbs={breadcrumbsConfig}>
        <Box sx={styleBox}>
          <DataGrid
            rows={projects}
            columns={projectsList}
            onRowClick={params => handleRowClick(params.row.id)}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            hideFooterPagination
          />
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default Configs;
