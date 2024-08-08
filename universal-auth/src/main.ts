import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.variables';
import { ServerConfig } from './config/server.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  
  app.enableCors();
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(serverConfig.getPort());
  logger.log('Server started on port ' + serverConfig.getPort());
  logger.log('Current time: ' + new Date().toLocaleString());
  logger.log('App version: ' + process.env.npm_package_version);
  logger.log('Current url ' + (await app.getUrl()));
}
bootstrap();
