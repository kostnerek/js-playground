import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { AuthConfig } from './auth.config';
import { DatabaseConfig } from './database.config';
import { validate } from './env.variables';
import { ServerConfig } from './server.config';
import { FacebookConfig } from './facebook.config';
import { GoogleConfig } from './google.config';
import { MailConfig } from './mail.config';
import { ThrottlerConfig } from './throttler.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
    }),
  ],
  providers: [ServerConfig, DatabaseConfig, AuthConfig, FacebookConfig, GoogleConfig, MailConfig, ThrottlerConfig],
  exports: [ServerConfig, DatabaseConfig, AuthConfig, FacebookConfig, GoogleConfig, MailConfig, ThrottlerConfig],
})
export class ConfigModule {}
