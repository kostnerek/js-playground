import { plainToClass, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsInt()
  @Transform(({ value }) => +value)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  MAGIC_LINK_SECRET: string;

  @IsInt()
  SALT_ROUNDS = 10;

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
