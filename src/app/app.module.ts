import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { RequestLoggerMiddleware } from '@/app/middlewares/request-logger.middleware';
import { UserModule } from '@/app/user/user.module';

import { AuthModule } from '@/contexts/auth/auth.module';
import { JwtExceptionFilter } from '@/contexts/filters/jwt-exception.filter';
import { LoggerModule } from '@/contexts/logger/logger.module';
import { PrismaModule } from '@/contexts/prisma/prisma.module';

import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    LoggerModule,
    AuthModule,
    UserModule,
    MoviesModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
