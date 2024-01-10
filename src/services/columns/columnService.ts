import { api, ResponseType } from '@/services/apiService';
import { ColumnType } from '@/types/Column';

export const getAllColumns = async (): Promise<ResponseType<ColumnType[]>> =>
  await api.get<ResponseType<ColumnType[]>>('/statuses/getAllStatuses').then(resolve => resolve.data);
export const createColumn = async (statusData: ColumnType): Promise<ResponseType<ColumnType>> =>
  await api.post<ResponseType<ColumnType>>('/statuses/createStatus', statusData).then(resolve => resolve.data);

export const deleteColumn = async (statusId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/statuses/deleteStatus?id=${statusId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting columns:', error);
    throw error;
  }
};

export const updateColumn = async (statusId: string, statusData: ColumnType): Promise<ColumnType> =>
  await api.put<ColumnType>(`/statuses/updateStatus?id=${statusId}`, statusData).then(resolve => resolve.data);
