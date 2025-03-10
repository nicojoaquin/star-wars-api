import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

import { RequestWithUser } from '@/src/contexts/lib/types/config';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user[data] : user;
  }
);
