import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  sub: string; // user ID
  email: string;
  role: string;
  primaryBranchId?: string;
  branches?: string[]; // Array of branch IDs the user has access to
}

export const User = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext): JwtUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUser;
    
    return data ? user?.[data] : user;
  },
);
