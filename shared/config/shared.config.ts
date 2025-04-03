import { registerAs } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const sharedConfig = registerAs('shared', () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'api',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    retryAttempts: 10,
    retryDelay: 3000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST || 'localhost',
    port: parseInt(process.env.ELASTICSEARCH_PORT || '9200', 10),
  },
  prometheus: {
    port: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
}));

@Injectable()
export class SharedConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  get isTest(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'test';
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseConfig() {
    return {
      ...this.configService.get('shared.database'),
      type: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  get rabbitMQConfig() {
    return {
      url: this.configService.get<string>('RABBITMQ_URL'),
      queue: this.configService.get<string>('RABBITMQ_QUEUE'),
      exchange: this.configService.get<string>('RABBITMQ_EXCHANGE'),
    };
  }

  get redisConfig() {
    return {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    };
  }

  get elasticsearchConfig() {
    return {
      node: this.configService.get<string>('ELASTICSEARCH_NODE'),
      username: this.configService.get<string>('ELASTICSEARCH_USERNAME'),
      password: this.configService.get<string>('ELASTICSEARCH_PASSWORD'),
    };
  }

  get jwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    };
  }

  get corsConfig() {
    return {
      origin: this.configService.get<string>('CORS_ORIGIN'),
      methods: this.configService.get<string>('CORS_METHODS'),
      credentials: this.configService.get<boolean>('CORS_CREDENTIALS'),
    };
  }

  get rateLimitConfig() {
    return {
      windowMs: this.configService.get<number>('RATE_LIMIT_WINDOW_MS'),
      max: this.configService.get<number>('RATE_LIMIT_MAX'),
    };
  }

  get loggingConfig() {
    return {
      level: this.configService.get<string>('LOG_LEVEL'),
      format: this.configService.get<string>('LOG_FORMAT'),
      timestamp: this.configService.get<boolean>('LOG_TIMESTAMP'),
    };
  }
} 