import { api } from '@/services/apiService';
import { Login, LoginResponse, Auth } from '@/types/Auth';

export const signUp = async ({ email, password, lastName, firstName }: Auth): Promise<Auth> =>
  await api.post<Auth>('/auth/signUp', { email, password, lastName, firstName }).then(resolve => resolve.data);

export const login = async ({ email, password }: Login): Promise<LoginResponse> =>
  await api.post<LoginResponse>('/auth/login', { email, password }).then(resolve => resolve.data);
