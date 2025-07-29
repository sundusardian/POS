// Authentication related types and interfaces

import { User } from './common';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
