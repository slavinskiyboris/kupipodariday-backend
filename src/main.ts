import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Настройка Swagger документации
  const config = new DocumentBuilder()
    .setTitle('KupiPodariDay API')
    .setDescription('API для сервиса вишлистов')
    .setVersion('1.0')
    .addTag('auth', 'Аутентификация')
    .addTag('users', 'Пользователи')
    .addTag('wishes', 'Подарки')
    .addTag('wishlists', 'Списки подарков')
    .addTag('offers', 'Предложения скинуться')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
