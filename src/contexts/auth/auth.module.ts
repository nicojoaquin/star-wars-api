import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@/src/app/user/user.module';

import { AuthController } from '@/contexts/auth/auth.controller';
import { AuthService } from '@/contexts/auth/auth.service';
import { Utils } from '@/contexts/lib/utils';

import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET')
        };
      },
      inject: [ConfigService]
    }),
    UserModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    Utils,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
