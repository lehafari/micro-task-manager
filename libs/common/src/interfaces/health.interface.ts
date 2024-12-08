export interface HealthCheck {
  service: string;
  status: string;
  timestamp: string;
  details?: Record<string, any>;
}
