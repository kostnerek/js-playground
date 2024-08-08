import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class GoogleConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getClientId(): string {
    return this.config.get<string>('GOOGLE_CLIENT_ID');
  }

  getClientSecret(): string {
    return this.config.get<string>('GOOGLE_CLIENT_SECRET');
  }

  getRedirectUri(): string {
    return this.config.get<string>('GOOGLE_REDIRECT_URI');
  }
}
