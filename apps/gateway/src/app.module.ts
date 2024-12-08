// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Local files
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';
import { UserModule } from './users/user.module';
import { HealthModule } from './health/health.module';
import { AppConfigModule } from './config/app-config.module';

const MODULES = [
  ConfigModule.forRoot(),
  AppConfigModule,
  HealthModule,

  AuthModule,
  TaskModule,
  UserModule,
];

@Module({
  imports: [...MODULES],
})
export class AppModule {}
