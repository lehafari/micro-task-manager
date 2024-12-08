// Nestjs dependencies
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Lib
import { HealthCheck, Services, ServicesConfig } from '@app/common';

// Other dependencies
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(
    @Inject(Services.AUTH) private readonly authClient: ClientProxy,
    @Inject(Services.TASKS) private readonly tasksClient: ClientProxy,
    @Inject(Services.USERS) private readonly usersClient: ClientProxy,
  ) {}

  async checkServices() {
    const healthChecks = await Promise.all([
      this.checkServiceHealth(Services.AUTH, this.authClient),
      this.checkServiceHealth(Services.TASKS, this.tasksClient),
      this.checkServiceHealth(Services.USERS, this.usersClient),
    ]);

    return {
      gateway: {
        service: 'api-gateway',
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      services: Object.assign({}, ...healthChecks),
    };
  }

  private async checkServiceHealth(
    serviceName: Services,
    client: ClientProxy,
  ): Promise<Record<string, HealthCheck>> {
    try {
      const health = await firstValueFrom(
        client.send({ cmd: 'health_check' }, {}),
      );

      return {
        [serviceName]: health,
      };
    } catch (error) {
      return {
        [serviceName]: {
          service: ServicesConfig[serviceName].name,
          status: 'error',
          timestamp: new Date().toISOString(),
          details: {
            error: error.message,
            status: 'unavailable',
          },
        },
      };
    }
  }
}
