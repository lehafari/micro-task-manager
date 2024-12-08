// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Services } from '@app/common/constants/services';

// Lib
import { getMicroserviceConfig } from '@app/common';

// Local files
import { TasksService } from './services';
import { TaskController } from './controllers';
import { AppConfigService } from '../config/services';

const CONTROLLERS = [TaskController];
const SERVICES = [TasksService];

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Services.TASKS,
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) =>
          getMicroserviceConfig(
            Services.TASKS,
            configService.tasksServiceTcpPort,
          ),
      },
    ]),
  ],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class TaskModule {}
