export type UserType = {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  assignedTo?: string;
  role: UserRoleType;
  id: string;
  iconColor?: string;
};

export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'user',
}
