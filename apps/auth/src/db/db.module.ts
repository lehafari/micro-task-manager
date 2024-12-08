// Nestjs dependencies
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/services/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        type: 'postgres',
        ...configService.databaseConfig,
        autoLoadEntities: true,
        synchronize: configService.env !== 'production',
        //logging: configService.env === 'development',
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class DbModule {}
