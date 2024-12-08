// Nestjs dependencies
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// Local files
import { AppModule } from './app.module';
import { AppConfigService } from './config/services/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = app.get(AppConfigService).port;
  const tcpPort = port + 100;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(tcpPort),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.startAllMicroservices();
  Logger.log(`🚀 Microservice TCP listening on port ${tcpPort}`, 'Tasks');

  await app.listen(port);
  Logger.log(`🚀 HTTP Server running on port ${port}`, 'Tasks');
}
bootstrap();
