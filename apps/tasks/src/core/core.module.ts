// Nestjs dependencies
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';

// Lib
import { getMicroserviceConfig, Services } from '@app/common';

// Local files
import { Task } from './entities';
import { TasksService } from './services';
import { TaskController } from './controllers';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/services/app-config.service';

const MODULES = [
  AppConfigModule,
  TypeOrmModule.forFeature([Task]),
  ClientsModule.registerAsync([
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
];
const CONTROLLERS = [TaskController];
const SERVICES = [TasksService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class CoreModule {}
