import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class FacebookConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getAppId(): string {
    return this.config.get<string>('FACEBOOK_APP_ID');
  }

  getAppSecret(): string {
    return this.config.get<string>('FACEBOOK_APP_SECRET');
  }

  getRedirectUri(): string {
    return this.config.get<string>('FACEBOOK_REDIRECT_URI');
  }
}
