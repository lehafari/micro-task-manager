// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Local files
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';
import { AppConfigModule } from './config/app-config.module';
import { CoreModule } from './core/core.module';

const MODULES = [
  ConfigModule.forRoot(),
  AppConfigModule,
  HealthModule,
  DbModule,
  CoreModule,
];

@Module({
  imports: [...MODULES],
})
export class AppModule {}