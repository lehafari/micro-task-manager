// Nestjs dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { BaseConfigService } from '@app/common/config/services/base-config.service';

@Injectable()
export class AppConfigService extends BaseConfigService {}
