export type CreateUserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoleType;
  createdAt: Date;
};

export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'user',
}
