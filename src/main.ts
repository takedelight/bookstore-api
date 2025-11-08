import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bookstore API')
    .setDescription('The Bookstore API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
bootstrap().catch((err) => console.error(err));
