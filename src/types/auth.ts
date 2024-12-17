export interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Professor {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  passwordHash: string;
}
