import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { EXTRA_MODELS } from './models';

export const swaggerSetup = (app: INestApplication<unknown>): void => {
  const config = new DocumentBuilder()
    .setTitle('Kingsforms API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'token'
    )
    .addSecurityRequirements('token')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: EXTRA_MODELS
  });

  document.paths = Object.keys(document.paths)
    .sort((a, b) => a.localeCompare(b))
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((obj, key) => {
      obj[key] = document.paths[key];
      return obj;
    }, {});

  SwaggerModule.setup('docs', app, document);
};
