// Nestjs dependencies
import { Global, Module } from '@nestjs/common';

// Local files
import { BaseConfigService } from './services/base-config.service';

@Global()
@Module({
  providers: [BaseConfigService],
  exports: [BaseConfigService],
})
export class BaseConfigModule {}
