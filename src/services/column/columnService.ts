import { api, ResponseType } from '@/services/apiService';
import { ColumnType } from '@/types/Column';

export const getAllColumns = async (): Promise<ResponseType<ColumnType[]>> =>
  await api.get<ResponseType<ColumnType[]>>('/statuses/getAllStatuses').then(resolve => resolve.data);
export const createColumn = async (statusData: ColumnType): Promise<ColumnType> =>
  await api.post<ColumnType>('/statuses/createStatus', statusData).then(resolve => resolve.data);

export const deleteColumn = async (statusId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/statuses/deleteStatus?id=${statusId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting column:', error);
    throw error;
  }
};

export const updateColumn = async (statusId: string, statusData: ColumnType): Promise<ResponseType<ColumnType>> => {
  try {
    const response = await api.put<ResponseType<ColumnType>>(`/statuses/updateStatus?id=${statusId}`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating column:', error);
    throw error;
  }
};
export const updateColumns = async (statusData: ColumnType[]): Promise<ResponseType<ColumnType>> => {
  try {
    const response = await api.patch<ResponseType<ColumnType>>(`/statuses/updateStatuses`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating column:', error);
    throw error;
  }
};
