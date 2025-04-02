import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS для фронтенда
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
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

  const options = {
    explorer: true,
    swaggerOptions: {
      deepScanRoutes: false,
      docExpansion: 'none',
    },
  };

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
    extraModels: [],
    deepScanRoutes: false,
  });
  SwaggerModule.setup('api', app, document, options);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
