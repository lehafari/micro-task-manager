// Nestjs dependencies
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';

// Lib
import { getMicroserviceConfig, Services } from '@app/common';

// Local files
import { AuthUser } from './entities';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { AppConfigService } from '../config/services';
import { AppConfigModule } from '../config/app-config.module';
import { JwtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';

const MODULES = [
  PassportModule.register({ defaultStrategy: 'jwt' }),
  AppConfigModule,
  TypeOrmModule.forFeature([AuthUser]),
  JwtModule.registerAsync({
    imports: [AppConfigModule],
    useFactory: (configService: AppConfigService) => ({
      secret: configService.jwtSecret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    inject: [AppConfigService],
  }),
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
const CONTROLLERS = [AuthController];
const SERVICES = [AuthService];
const STRATEGIES = [JwtStrategy];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES, ...STRATEGIES],
  exports: [...SERVICES],
})
export class CoreModule {}
