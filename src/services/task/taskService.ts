import { api, ResponseType } from '@/services/apiService';
import { TaskType } from '@/types/Task';

export const getAllTasks = async (projectId: string): Promise<ResponseType<TaskType[]>> => {
  return await api
    .get<ResponseType<TaskType[]>>(`/tasks/getAllTasks`, { params: { projectId } })
    .then(response => response.data);
};
export const createTask = async (taskData: TaskType): Promise<ResponseType<TaskType>> =>
  await api.post<ResponseType<TaskType>>('/tasks/createTask', taskData).then(resolve => resolve.data);

export const deleteTask = async (taskId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/tasks/deleteTask?id=${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, taskData: TaskType): Promise<TaskType> =>
  await api.put<TaskType>(`/tasks/updateTask?id=${taskId}`, taskData).then(resolve => resolve.data);
export const updateTasks = async (taskData: TaskType[]): Promise<ResponseType<TaskType>> => {
  try {
    const response = await api.patch<ResponseType<TaskType>>('/tasks/updateTasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating tasks:', error);
    throw error;
  }
};
