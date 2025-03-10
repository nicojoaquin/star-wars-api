import { User } from '@prisma/client';

export type RequestWithUser = Express.Request & { user: User };
