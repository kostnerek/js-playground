import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';
import { ServerConfig } from './server.config';

@Injectable()
export class MailConfig {
  serverConfig: any;
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {
    this.serverConfig = new ServerConfig(config);
  }

  getMailHost() {
    return this.config.get('MG_HOST');
  }

  getApiKey() {
    return this.config.get('MG_API_KEY');
  }
}
