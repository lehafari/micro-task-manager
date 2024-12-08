// Nestjs dependencies
import { Module } from '@nestjs/common';

// Local files
import { HealthController } from './controller/health.controller';

const CONTROLLERS = [HealthController];

@Module({
  controllers: [...CONTROLLERS],
})
export class HealthModule {}
