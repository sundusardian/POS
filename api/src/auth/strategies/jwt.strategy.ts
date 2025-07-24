import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev_secret_key_change_in_production',
    });
  }

  async validate(payload: JwtPayload) {
    // You can add additional validation here if needed
    const user = await this.usersService.findOneWithBranches(payload.sub);
    
    // Extract branch IDs from user branches
    const branches = user.branches?.map(ub => ub.branchId) || [];
    
    // Return the user object that will be attached to the request object
    return {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      primaryBranchId: user.primaryBranchId,
      branches,
    };
  }
}
