import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.variables';

@Injectable()
export class ServerConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getPort(): number {
    return this.config.get<number>('PORT') || 3000;
  }

  getJwtSecret(): string {
    return this.config.get<string>('JWT_SECRET') || 'secret';
  }

  getAppName(): string {
    return this.config.get<string>('APP_NAME') || '2FA';
  }

  getFrontendUrl(): string {
    return this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }
}
