import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { LoggerService } from './common/services/logger.service';
import { MetricsMiddleware } from './common/middleware/metrics.middleware';
import configuration from './config/configuration';
import { Task } from './entities/task.entity';
import { AvettaDocAgentModule } from './avetta-doc-agent/avetta-doc-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
      ...(process.env.NODE_ENV === 'test' 
        ? {
            database: ':memory:',
            entities: [Task],
            synchronize: true,
            dropSchema: true,
          }
        : {
            host: process.env.DB_HOST || 'db',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'api',
            entities: [Task],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV !== 'production',
          }
      ),
    }),
    TasksModule,
    HealthModule,
    MetricsModule,
    AvettaDocAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
