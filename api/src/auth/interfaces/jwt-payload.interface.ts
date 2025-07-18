import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: Role;
}
