import { api } from '@/services/apiService';
import { Login, LoginResponse, Auth, AuthResponse } from '@/types/Auth';

export const signUp = async ({ email, password, lastName, firstName }: Auth): Promise<AuthResponse> =>
  await api.post<AuthResponse>('/auth/signUp', { email, password, lastName, firstName }).then(resolve => resolve.data);

export const login = async ({ email, password }: Login): Promise<LoginResponse> =>
  await api.post<LoginResponse>('/auth/login', { email, password }).then(resolve => resolve.data);
