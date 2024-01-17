export type Auth = {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};
export type AuthResponse = {
  token: string;
  refreshToken: string;
  userId: string;
  assignedTo: string;
};

export type Login = {
  password: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  userId: string;
  assignedTo: string;
};
