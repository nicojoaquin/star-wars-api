import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app/app.module';

import { swaggerSetup } from './config/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //Middlewares setup
  app.enableCors({ origin: '*' }); //TODO: only accept from frontend
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true
    })
  );

  swaggerSetup(app);

  const port = configService.get<string>('PORT', '8000');
  const apiUrl = configService.get<string>('API_URL', 'http://localhost');
  const isEnv = configService.get<string>('NODE_ENV', 'development');

  await app.listen(port, '0.0.0.0');

  const url = isEnv ? `${apiUrl}:${port}` : apiUrl;

  const logger = app.get(Logger);
  logger.log(`App is ready on ${url} 🚀`);
  logger.log(`Docs on ${url}/docs`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on('uncaughtException', handleError);
