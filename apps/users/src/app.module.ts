// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Local files
import { DbModule } from './db/db.module';
import { CoreModule } from './core/core.module';
import { TeamModule } from './teams/team.module';
import { HealthModule } from './health/health.module';
import { AppConfigModule } from './config/app-config.module';

const MODULES = [
  ConfigModule.forRoot(),
  AppConfigModule,
  HealthModule,
  DbModule,

  // app
  CoreModule,
  TeamModule,
];

@Module({
  imports: [...MODULES],
})
export class AppModule {}
