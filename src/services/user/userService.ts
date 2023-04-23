import { UserType } from '@/types/User';
import { api, ResponseType } from '@/services/apiService';

export const getUsers = async (): Promise<ResponseType<UserType[]>> =>
  await api.get<ResponseType<UserType[]>>('/users/getAllUsers').then(resolve => resolve.data);
