// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Services } from '@app/common/constants/services';

// Lib
import { getMicroserviceConfig } from '@app/common';

// Local files
import { TeamsService, UserService } from './services';
import { AppConfigService } from '../config/services';
import { TeamsController, UsersController } from './controllers';

const CONTROLLERS = [UsersController, TeamsController];
const SERVICES = [UserService, TeamsService];

@Module({
  imports: [
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
  ],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class UserModule {}
