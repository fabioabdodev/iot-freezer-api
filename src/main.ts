import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // remove campos extras
      forbidNonWhitelisted: true,   // dá erro se mandar campo extra
      transform: true,              // tenta converter tipos (string -> number)
    }),
  );

  await app.listen(3000);
}
bootstrap();
