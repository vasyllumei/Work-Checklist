import { api } from '@/services/apiService';
import { Login, LoginResponse, Auth, AuthResponse } from '@/types/Auth';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';

export const signUp = async ({ email, password, lastName, firstName }: Auth): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/signUp', { email, password, lastName, firstName });

    const { token } = response.data;
    Cookies.set(LOCAL_STORAGE_TOKEN, token);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async ({ email, password }: Login): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    const { token, refreshToken, role, userId, iconColor } = response.data;
    Cookies.set(LOCAL_STORAGE_TOKEN, token);
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        userId,
        role,
        iconColor,
        refreshToken,
      }),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
