import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const protocol = configService.get<string>('APP_PROTOCOL');
  const hostname = configService.get<string>('APP_HOST');
  const port = configService.get<string>('APP_PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validationError: { target: true },
    }),
  );
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
  Logger.log(`Server started on ${protocol}://${hostname}:${port}`, 'Bootstrap');
}
bootstrap();
