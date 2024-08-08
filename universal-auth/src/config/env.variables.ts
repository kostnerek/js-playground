import { plainToClass, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Production = 'production',
  Test = 'test',
}

export enum SentryEnvironment {
  Local = 'local',
  Production = 'production',
  Staging = 'staging',
  ClientStaging = 'client-staging',
}

export class EnvironmentVariables {
  @IsInt()
  @Transform(({ value }) => +value)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsInt()
  RATE_LIMIT_MAX = 1000;

  @IsInt()
  RATE_LIMIT_WINDOW_MS: number = 60 * 1000; // 1 Minute

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsInt()
  SALT_ROUNDS = 10;

  @IsString()
  FRONTEND_URL = 'http://localhost:3000';

  @IsInt()
  @Transform(({ value }) => +value)
  TOKEN_EXIRES_IN_MINUTES = 60 * 24 * 1;

  @IsInt()
  @Transform(({ value }) => +value)
  REFRESH_TOKEN_EXIRES_IN_MINUTES = 60 * 24 * 7;

  @IsString()
  @IsNotEmpty()
  DATABASE_URI: string;

  @IsString()
  @IsNotEmpty()
  MG_HOST: string;

  @IsString()
  @IsNotEmpty()
  MG_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_REDIRECT_URI: string;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_ID: string;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_SECRET: string;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_REDIRECT_URI: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
