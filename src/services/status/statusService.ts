import { api, ResponseType } from '@/services/apiService';
import { StatusDocumentType } from '@/types/Column';

export const getAllStatus = async (): Promise<ResponseType<StatusDocumentType[]>> =>
  await api.get<ResponseType<StatusDocumentType[]>>('/status/getAllStatus').then(resolve => resolve.data);
export const createStatus = async (statusData: StatusDocumentType): Promise<ResponseType<StatusDocumentType>> =>
  await api.post<ResponseType<StatusDocumentType>>('/status/createStatus', statusData).then(resolve => resolve.data);
