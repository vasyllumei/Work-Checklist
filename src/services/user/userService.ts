import { UserType } from '@/types/User';
import { api, ResponseType } from '@/services/apiService';

interface GetAllUsersParams {
  skip?: number;
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
  filter?: string;
}

export const getAllUsers = async (params?: GetAllUsersParams): Promise<ResponseType<UserType[]>> => {
  try {
    const response = await api.get<ResponseType<UserType[]>>('/users/getAllUsers', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const createUser = async (userData: UserType): Promise<ResponseType<UserType>> => {
  try {
    const response = await api.post<ResponseType<UserType>>('/users/createUser', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/users/deleteUser?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const deleteAllUsers = async (userIds: string[]): Promise<ResponseType<{ success: boolean }>> => {
  try {
    const response = await api.delete<ResponseType<{ success: boolean }>>('/users/deleteAllUsers', {
      data: { userIds },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting users:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: UserType): Promise<UserType> => {
  try {
    const response = await api.put<UserType>(`/users/updateUser?id=${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
