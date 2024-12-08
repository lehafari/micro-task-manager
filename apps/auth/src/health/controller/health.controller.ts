// Nestjs dependencies
import { Controller } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MessagePattern } from '@nestjs/microservices';

// Other dependencies
import { DataSource } from 'typeorm';

// Lib
import { HealthCheck } from '@app/common';

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @MessagePattern({ cmd: 'health_check' })
  async getHealth(): Promise<HealthCheck> {
    let dbStatus = 'error';
    let dbError = null;

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbStatus = 'connected';
      }
    } catch (error) {
      dbError = error.message;
      dbStatus = 'disconnected';
    }

    return {
      service: 'auth-service',
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      details: {
        database: {
          status: dbStatus,
          error: dbError,
        },
        version: '1.0.0',
      },
    };
  }
}
