// Nestjs dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { BaseConfigService } from '@app/common/config/services/base-config.service';

@Injectable()
export class AppConfigService extends BaseConfigService {
  get jwtSecret(): string {
    return process.env.JWT_SECRET;
  }

  get authServiceTcpPort(): number {
    return Number(process.env.AUTH_TCP_PORT) || 3401;
  }

  get tasksServiceTcpPort(): number {
    return Number(process.env.TASKS_TCP_PORT) || 3402;
  }

  get usersServiceTcpPort(): number {
    return Number(process.env.USERS_TCP_PORT) || 3403;
  }
}
