import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { EnvironmentVariables } from './env.variables';
import { ServerConfig } from './server.config';

@Injectable()
export class DatabaseConfig implements MongooseOptionsFactory {
  serverConfig: any;
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {
    this.serverConfig = new ServerConfig(config);
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get('DATABASE_URI'),
      retryDelay: 1000,
      retryAttempts: 1,
    };
  }
}
