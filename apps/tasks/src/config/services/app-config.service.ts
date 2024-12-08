// Nestjs dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { BaseConfigService } from '@app/common/config/services/base-config.service';

@Injectable()
export class AppConfigService extends BaseConfigService {
  get usersServiceTcpPort(): number {
    return Number(process.env.USERS_TCP_PORT) || 3403;
  }
}
