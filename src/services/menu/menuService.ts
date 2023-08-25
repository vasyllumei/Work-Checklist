import { api, ResponseType } from '@/services/apiService';
import { MenuDocumentType } from '@/models/Menu';

export const getAllMenus = async (): Promise<ResponseType<MenuDocumentType[]>> =>
  await api.get<ResponseType<MenuDocumentType[]>>('/menus/getAllMenus').then(resolve => resolve.data);
