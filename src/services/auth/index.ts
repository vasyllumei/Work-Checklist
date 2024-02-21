import { api } from '@/services/apiService';
import { Login, LoginResponse, AuthResponse, Auth } from '@/types/Auth';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';

export const signUp = async ({ email, password, lastName, firstName }: Auth): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/signUp', { email, password, lastName, firstName });

    const { token, refreshToken, user } = response.data;

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        user,
        refreshToken,
      }),
    );

    Cookies.set(LOCAL_STORAGE_TOKEN, token);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async ({ email, password }: Login): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    const { token, refreshToken, user } = response.data;

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        user,
        refreshToken,
      }),
    );

    Cookies.set(LOCAL_STORAGE_TOKEN, token);

    return response.data;
  } catch (error) {
    throw error;
  }
};
