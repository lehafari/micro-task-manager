// Nestjs dependencies
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Services } from '@app/common/constants/services';

// Lib
import { getMicroserviceConfig } from '@app/common';

// Local files
import { AuthService } from './services';
import { AuthController } from './controllers';
import { AppConfigService } from '../config/services';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';

const CONTROLLERS = [AuthController];
const SERVICES = [AuthService];
const STRATEGIES = [JwtStrategy];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    ]),
  ],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES, ...STRATEGIES],
})
export class AuthModule {}
