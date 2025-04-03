import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsString()
  TEST_DB_HOST: string;

  @IsNumber()
  TEST_DB_PORT: number;

  @IsString()
  TEST_DB_USERNAME: string;

  @IsString()
  TEST_DB_PASSWORD: string;

  @IsString()
  TEST_DB_DATABASE: string;

  @IsString()
  RABBITMQ_URL: string;

  @IsString()
  RABBITMQ_QUEUE: string;

  @IsString()
  RABBITMQ_EXCHANGE: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  ELASTICSEARCH_NODE: string;

  @IsString()
  ELASTICSEARCH_USERNAME: string;

  @IsString()
  ELASTICSEARCH_PASSWORD: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  CORS_ORIGIN: string;

  @IsString()
  CORS_METHODS: string;

  @IsNumber()
  RATE_LIMIT_WINDOW_MS: number;

  @IsNumber()
  RATE_LIMIT_MAX: number;

  @IsString()
  LOG_LEVEL: string;

  @IsString()
  LOG_FORMAT: string;
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