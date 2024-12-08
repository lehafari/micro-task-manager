// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Services } from '@app/common/constants/services';

// Lib
import { getMicroserviceConfig } from '@app/common';

// Local files
import { HealthService } from './services/health.service';
import { AppConfigService } from '../config/services/app-config.service';
import { HealthController } from './controllers/health.controller';

const CONTROLLERS = [HealthController];
const SERVICES = [HealthService];

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Services.AUTH,
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) =>
          getMicroserviceConfig(
            Services.AUTH,
            configService.authServiceTcpPort,
          ),
      },
      {
        name: Services.TASKS,
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) =>
          getMicroserviceConfig(
            Services.TASKS,
            configService.tasksServiceTcpPort,
          ),
      },
      {
        name: Services.USERS,
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) =>
          getMicroserviceConfig(
            Services.USERS,
            configService.usersServiceTcpPort,
          ),
      },
    ]),
  ],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class HealthModule {}
