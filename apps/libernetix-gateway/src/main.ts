import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  app.setGlobalPrefix(configService.get('GLOBAL_PREFIX'));
  await app.listen(configService.get('PORT') ? parseInt(configService.get('PORT'), 10) : 3000);
}
bootstrap();
