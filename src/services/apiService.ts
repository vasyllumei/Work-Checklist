import axios from 'axios';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import Cookies from 'js-cookie';

export type ResponseType<Data> = {
  data: Data;
  message?: string;
  totalCount: number;
};
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  responseType: 'json',
});

api.interceptors.request.use(
  config => {
    const token = Cookies.get(LOCAL_STORAGE_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export { api };
