import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // remove campos extras
      forbidNonWhitelisted: true,   // dá erro se mandar campo extra
      transform: true,              // tenta converter tipos (string -> number)
    }),
  );

  await app.listen(port, '0.0.0.0');
}
bootstrap();
