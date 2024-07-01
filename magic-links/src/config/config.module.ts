import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { AuthConfig } from './auth.config';
import { DatabaseConfig } from './database.config';
import { validate } from './env.variables';
import { ServerConfig } from './server.config';
import { MailConfig } from './mail.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
    }),
  ],
  providers: [ServerConfig, DatabaseConfig, AuthConfig, MailConfig],
  exports: [ServerConfig, DatabaseConfig, AuthConfig, MailConfig],
})
export class ConfigModule {}
