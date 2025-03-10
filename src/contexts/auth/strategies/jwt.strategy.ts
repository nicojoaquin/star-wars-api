import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '@/src/app/user/user.service';

import { JwtPayload } from '@/contexts/auth/lib/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET')
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.sub, { findBy: 'id' });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
