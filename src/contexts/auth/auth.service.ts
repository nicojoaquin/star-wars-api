import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { SanitizedUser } from '@/src/app/user/lib/types';
import { UserService } from '@/src/app/user/user.service';

import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { InvalidTokenException } from '../exceptions/token-invalid-exception';
import { Utils } from '../lib/utils';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload, UserWithTokenResponse } from './lib/types';

@Injectable()
export class AuthService {
  private readonly EXPIRES_IN_ACCESS = '4h';

  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser(username: string, userPassword?: string): Promise<User> {
    const user = await this.userService.findOne(username.trim().toLowerCase(), {
      findBy: 'username'
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isUserCorrect = await Utils.compareHashedString(
      userPassword,
      user.password
    );

    if (!isUserCorrect) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async signIn(dto: SignInDto): Promise<UserWithTokenResponse> {
    const user = await this.validateUser(dto.username, dto.password);

    const sanitizedUser = this.userService.sanitizeUser(user);
    const token = await this.createToken(user);

    return { token, user: sanitizedUser };
  }

  async signUp(dto: SignUpDto): Promise<UserWithTokenResponse> {
    const password = await Utils.hashString(dto.password);

    const user = await this.userService.create({
      name: dto.name,
      username: dto.username.trim().toLowerCase(),
      password
    });
    const sanitizedUser = this.userService.sanitizeUser(user);
    const token = await this.createToken(user);

    return { token, user: sanitizedUser };
  }

  async createToken(user: SanitizedUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role
    };

    const expiresIn = this.EXPIRES_IN_ACCESS;
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  async verifyToken(
    token: string,
    ignoreExpiration: boolean = false
  ): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        ignoreExpiration
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new TokenExpiredException();
        } else if (error.name === 'JsonWebTokenError') {
          throw new InvalidTokenException();
        } else {
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
    }
  }
}
