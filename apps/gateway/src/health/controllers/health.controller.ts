// Nestjs dependencies
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// Local files
import { HealthService } from '../services/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check health of all services' })
  async checkHealth() {
    return this.healthService.checkServices();
  }
}
