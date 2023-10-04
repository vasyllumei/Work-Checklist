import axios from 'axios';
import { LOCAL_STORAGE_TOKEN } from '@/constants';

export type ResponseType<Data> = {
  data: Data;
  message?: string;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  responseType: 'json',
});
if (typeof window !== 'undefined') {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}
