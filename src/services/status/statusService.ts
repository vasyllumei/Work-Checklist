import { api, ResponseType } from '@/services/apiService';
import { StatusType } from '@/types/Column';

export const getAllStatuses = async (): Promise<ResponseType<StatusType[]>> =>
  await api.get<ResponseType<StatusType[]>>('/statuses/getAllStatuses').then(resolve => resolve.data);
export const createStatus = async (statusData: StatusType): Promise<ResponseType<StatusType>> =>
  await api.post<ResponseType<StatusType>>('/statuses/createStatus', statusData).then(resolve => resolve.data);

export const deleteStatus = async (statusId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/statuses/deleteStatus?id=${statusId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting status:', error);
    throw error;
  }
};

export const updateStatus = async (statusId: string, statusData: StatusType): Promise<StatusType> =>
  await api.put<StatusType>(`/statuses/updateStatus?id=${statusId}`, statusData).then(resolve => resolve.data);
