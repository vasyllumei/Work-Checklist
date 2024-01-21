export type UserType = {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role: UserRoleType;
  id: string;
  iconColor?: string;
};

export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'user',
}
