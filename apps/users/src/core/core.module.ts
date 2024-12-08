// Nestjs dependencies
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { User } from './entities';
import { UsersService } from './services';
import { UsersController } from './controller';
import { AppConfigModule } from '../config/app-config.module';

const MODULES = [AppConfigModule, TypeOrmModule.forFeature([User])];
const CONTROLLERS = [UsersController];
const SERVICES = [UsersService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class CoreModule {}
