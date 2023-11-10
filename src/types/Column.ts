import { UserType } from '@/types/User';

export type ColumnType = {
  title: string;
  order: number;
  currentUser?: UserType;
  task?: any;
};
