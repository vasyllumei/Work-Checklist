import { api, ResponseType } from '@/services/apiService';
import { CardDocumentType } from '@/models/Task';

export const getAllCards = async (): Promise<ResponseType<CardDocumentType[]>> =>
  await api.get<ResponseType<CardDocumentType[]>>('/cards/getAllCards').then(resolve => resolve.data);
