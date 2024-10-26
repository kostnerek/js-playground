import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class ADConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getAppId(): string {
    return this.config.get<string>('AD_APP_ID');
  }

  getTenantUrl(): string {
    return this.config.get<string>('AD_TENANT_URL');
  }

  getRedirectUri(): string {
    return this.config.get<string>('AD_REDIRECT_URI');
  }

  getClientSecret(): string {
    return this.config.get<string>('AD_CLIENT_SECRET');
  }
}
