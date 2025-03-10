import { SanitizedUser } from '@/src/app/user/lib/types';

export type JwtPayload = {
  sub: number;
  username: string;
  role: string;
};

export type TokenType = 'access' | 'activate' | 'reset';

export type UserWithTokenResponse = { token: string; user: SanitizedUser };
