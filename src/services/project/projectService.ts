import { api, ResponseType } from '@/services/apiService';
import { ProjectType } from '@/types/Project';

export const getAllProjects = async (): Promise<ResponseType<ProjectType[]>> =>
  await api.get<ResponseType<ProjectType[]>>('/projects/getAllProjects').then(resolve => resolve.data);
export const createProject = async (projectData: ProjectType): Promise<ResponseType<ProjectType>> =>
  await api.post<ResponseType<ProjectType>>('/projects/createProject', projectData).then(resolve => resolve.data);

export const deleteProject = async (projectId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/projects/deleteProject?id=${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const updateActiveProject = async (projectId: string): Promise<ResponseType<ProjectType>> => {
  try {
    const response = await api.patch('/projects/updateActiveProject', { projectId });
    return response.data.project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};
export const updateProject = async (projectId: string, projectData: ProjectType): Promise<ProjectType> =>
  await api.put<ProjectType>(`/projects/updateProject?id=${projectId}`, projectData).then(resolve => resolve.data);

/*
export const updateProjects = async (projectData: ProjectType[]): Promise<ResponseType<ProjectType>> => {
  try {
    const response = await api.patch<ResponseType<ProjectType>>('/projects/updateProjects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating tasks:', error);
    throw error;
  }
};
*/
