import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from '../entities/base.entity';
import { BaseRepository } from '../repositories/base.repository';
import { BaseService } from '../services/base.service';
import { BaseController } from '../controllers/base.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BaseEntity])],
  providers: [BaseRepository, BaseService],
  controllers: [BaseController],
  exports: [BaseRepository, BaseService],
})
export class BaseModule {} 