import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.variables';

@Injectable()
export class AuthConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getSaltRounds(): number {
    return this.config.get<number>('SALT_ROUNDS') || 10;
  }

  getTokenExpirationTime(): number {
    return this.config.get<number>('TOKEN_EXIRES_IN_MINUTES') || 60 * 24 * 1;
  }

  getRefreshTokenExpirationTime(): number {
    return (
      this.config.get<number>('REFRESH_TOKEN_EXIRES_IN_MINUTES') || 60 * 24 * 7
    );
  }

  getJwtSecret(): string {
    return this.config.get<string>('JWT_SECRET') || 'secret';
  }
}
