import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.variables';

@Injectable()
export class ThrottlerConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}


  getRateLimitMax(): number {
    return this.config.get<number>('RATE_LIMIT_MAX') || 1000;
  }

  getRateLimitWindowMs(): number {
    return this.config.get<number>('RATE_LIMIT_WINDOW_MS') || 60 * 1000;
  }

  createThrottlerOptions() {
    return [{
      ttl: this.getRateLimitWindowMs(),
      limit: this.getRateLimitMax(),
    }];
  }
}
