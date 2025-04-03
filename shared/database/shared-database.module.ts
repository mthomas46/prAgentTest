import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sharedConfig } from '../config/shared.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(sharedConfig)],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('shared.database.host'),
        port: configService.get('shared.database.port'),
        username: configService.get('shared.database.username'),
        password: configService.get('shared.database.password'),
        database: configService.get('shared.database.database'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class SharedDatabaseModule {} 