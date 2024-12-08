// Nestjs dependencies
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

// Local files
import { Services, ServicesConfig } from '../constants/services';

export const getMicroserviceConfig = (
  service: Services,
  tcpPort: number,
): ClientProviderOptions => ({
  name: service,
  transport: Transport.TCP,
  options: {
    host: ServicesConfig[service].host,
    port: tcpPort,
  },
});
