// Nestjs dependencies
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { TeamsService } from './services';
import { Team } from './entities/team.entity';
import { TeamController } from './controllers';
import { CoreModule } from '../core/core.module';
import { AppConfigModule } from '../config/app-config.module';

const MODULES = [CoreModule, AppConfigModule, TypeOrmModule.forFeature([Team])];
const CONTROLLERS = [TeamController];
const SERVICES = [TeamsService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class TeamModule {}
