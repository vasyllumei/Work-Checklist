import { UserType } from '@/types/User';
import { api, ResponseType } from '@/services/apiService';

export const getAllUsers = async (): Promise<ResponseType<UserType[]>> =>
  await api.get<ResponseType<UserType[]>>('/users/getAllUsers').then(resolve => resolve.data);

export const createUser = async (userData: UserType): Promise<ResponseType<UserType>> =>
  await api.post<ResponseType<UserType>>('/users/createUser', userData).then(resolve => resolve.data);

export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/users/deleteUser?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: UserType): Promise<UserType> =>
  await api.put<UserType>(`/users/updateUser?id=${userId}`, userData).then(resolve => resolve.data);
