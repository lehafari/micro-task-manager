// Nestjs dependencies
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Local files
import { AppModule } from './app.module';
import { AppConfigService } from './config/services/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = app.get(AppConfigService).env;
  const port = app.get(AppConfigService).port;
  const globalPrefix = app.get(AppConfigService).globalPrefix;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  app.setGlobalPrefix(globalPrefix);

  if (env === 'development') {
    const options = new DocumentBuilder()
      .setTitle('MicroTask Manager API')
      .setDescription('Task Management System API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    Logger.log(
      `Swagger is running on: http://localhost:${port}/docs`,
      'Swagger',
    );
  }

  await app.listen(port);
}
bootstrap();
