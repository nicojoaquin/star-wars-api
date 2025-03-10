import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

import { RequestWithUser } from '@/contexts/lib/types/config';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (user.role === UserRole.Admin) return true;

    const hasRoles = requiredRoles.some(role => user?.role?.includes(role));

    if (!hasRoles)
      throw new UnauthorizedException(
        'You are not authorized to do this action'
      );

    return true;
  }
}
