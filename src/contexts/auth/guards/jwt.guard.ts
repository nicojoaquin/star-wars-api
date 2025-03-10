import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';

import { TokenExpiredException } from '../../exceptions/token-expired.exception';
import { InvalidTokenException } from '../../exceptions/token-invalid-exception';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<TUser = JwtPayload>(
    err: Error | null,
    user: TUser | null,
    info: UnauthorizedException | null
  ): TUser {
    if (info && info.name === 'TokenExpiredError') {
      throw new TokenExpiredException();
    } else if (err || !user) {
      throw new InvalidTokenException();
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
