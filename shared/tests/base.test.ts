import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from '../services/base.service';
import { BaseRepository } from '../repositories/base.repository';
import { BaseEntity } from '../entities/base.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export class BaseTest {
  protected module: TestingModule;
  protected service: BaseService<any>;
  protected repository: BaseRepository<any>;

  async setupTest(serviceClass: any, repositoryClass: any, entityClass: any) {
    this.module = await Test.createTestingModule({
      providers: [
        serviceClass,
        repositoryClass,
        {
          provide: getRepositoryToken(entityClass),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    this.service = this.module.get<BaseService<any>>(serviceClass);
    this.repository = this.module.get<BaseRepository<any>>(repositoryClass);
  }

  async teardownTest() {
    await this.module.close();
  }
} 