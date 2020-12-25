import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { config } from './core';
import { CoreValidationPipe } from './shared/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  app.useGlobalPipes(
    new CoreValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validationError: { target: true },
    }),
  );
  app.use(compression());
  app.use(helmet());
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
  Logger.log(`Server started on ${config.app.protocol}://${config.app.host}:${port}`, 'Bootstrap');
}
bootstrap();
