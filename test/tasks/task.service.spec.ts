import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from '../../services/task-service/src/task.service';
import { Task, TaskPriority } from '../../services/task-service/src/task.entity';
import { EventPublisherService } from '../../shared/services/event-publisher.service';
import { ICreateTaskDto } from '../../shared/interfaces/task.interface';
import { mockTask } from '../mocks/task.entity.mock';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;
  let eventPublisher: EventPublisherService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  const mockEventPublisher = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
        {
          provide: EventPublisherService,
          useValue: mockEventPublisher,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    eventPublisher = module.get<EventPublisherService>(EventPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [mockTask];
      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('1');
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('1');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: ICreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.LOW,
      };

      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
      expect(eventPublisher.publish).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateData = { title: 'Updated Task' };
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue({ ...mockTask, ...updateData });

      const result = await service.update('1', updateData);
      expect(result).toEqual({ ...mockTask, ...updateData });
      expect(eventPublisher.publish).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete a task', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.delete('1');
      expect(mockRepository.softDelete).toHaveBeenCalledWith('1');
      expect(eventPublisher.publish).toHaveBeenCalled();
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted task', async () => {
      mockRepository.restore.mockResolvedValue({ affected: 1 });

      await service.restore('1');
      expect(mockRepository.restore).toHaveBeenCalledWith('1');
      expect(eventPublisher.publish).toHaveBeenCalled();
    });
  });
});
