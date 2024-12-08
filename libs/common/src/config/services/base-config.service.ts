// Nestjs dependencies
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseConfigService {
  get env(): string {
    return process.env.NODE_ENV || 'development';
  }

  get globalPrefix(): string {
    return process.env.GLOBAL_PREFIX || 'api/v1';
  }

  get port(): number {
    return Number(process.env.PORT) || 3000;
  }

  get databaseConfig() {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
  }

  get tcpPort(): number {
    return Number(process.env.TCP_PORT) || 4000;
  }
}
