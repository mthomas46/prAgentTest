// Mock TypeORM
jest.mock('typeorm', () => ({
  Repository: jest.fn(),
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  CreateDateColumn: jest.fn(),
  UpdateDateColumn: jest.fn(),
  DeleteDateColumn: jest.fn(),
}));

// Mock @nestjs/typeorm
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => jest.fn(),
  TypeOrmModule: {
    forFeature: jest.fn(),
    forRoot: jest.fn(),
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../../services/task-service/src/task.service';
import { TaskStatus } from '../../shared/interfaces/task.interface';
import { EventPublisherService } from '../../shared/services/event-publisher.service';
import { Task } from '../../services/task-service/src/entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EventType } from '../../shared/interfaces/events.interface';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let eventPublisher: EventPublisherService;
  let inMemoryTasks: Task[] = [];
  let lastId = 0;

  const mockRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve(inMemoryTasks)),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => 
      Promise.resolve(inMemoryTasks.find(task => task.id === id))),
    create: jest.fn().mockImplementation((dto) => {
      const task = new Task();
      task.id = String(++lastId);
      task.title = dto.title;
      task.description = dto.description;
      task.status = dto.status || TaskStatus.PENDING;
      task.assignedTo = dto.assignedTo;
      task.dueDate = dto.dueDate;
      task.metadata = dto.metadata;
      task.createdAt = new Date();
      task.updatedAt = new Date();
      return task;
    }),
    save: jest.fn().mockImplementation((task) => {
      const index = inMemoryTasks.findIndex(t => t.id === task.id);
      if (index >= 0) {
        inMemoryTasks[index] = { ...inMemoryTasks[index], ...task };
      } else {
        inMemoryTasks.push(task);
      }
      return Promise.resolve(task);
    }),
    softDelete: jest.fn().mockImplementation((id) => {
      const index = inMemoryTasks.findIndex(task => task.id === id);
      if (index >= 0) {
        inMemoryTasks[index].deletedAt = new Date();
        return Promise.resolve({ affected: 1 });
      }
      return Promise.resolve({ affected: 0 });
    }),
    restore: jest.fn().mockImplementation((id) => {
      const index = inMemoryTasks.findIndex(task => task.id === id);
      if (index >= 0) {
        inMemoryTasks[index].deletedAt = undefined;
        return Promise.resolve({ affected: 1 });
      }
      return Promise.resolve({ affected: 0 });
    }),
  };

  const mockEventPublisher = {
    publishTaskEvent: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    inMemoryTasks = [];
    lastId = 0;
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: 'TaskRepository',
          useValue: mockRepository,
        },
        {
          provide: EventPublisherService,
          useValue: mockEventPublisher,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get('TaskRepository');
    eventPublisher = module.get<EventPublisherService>(EventPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const task1 = await service.create({ title: 'Task 1', description: 'Description 1' });
      const task2 = await service.create({ title: 'Task 2', description: 'Description 2' });

      const tasks = await service.findAll();
      expect(tasks).toHaveLength(2);
      expect(tasks[0].id).toBe(task1.id);
      expect(tasks[1].id).toBe(task2.id);
    });

    it('should handle errors when finding tasks', async () => {
      mockRepository.find.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const task = await service.create({ title: 'Task 1', description: 'Description 1' });
      const found = await service.findOne(task.id);
      expect(found).toEqual(task);
    });

    it('should throw NotFoundException when task is not found', async () => {
      await expect(service.findOne('999')).rejects.toThrow('Task with ID 999 not found');
    });
  });

  describe('create', () => {
    it('should create a task and publish event', async () => {
      const taskDto = { title: 'New Task', description: 'New Description' };
      const task = await service.create(taskDto);
      
      expect(task.title).toBe(taskDto.title);
      expect(task.description).toBe(taskDto.description);
      expect(mockEventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_CREATED,
        task.id,
        task
      );
    });

    it('should handle errors when creating task', async () => {
      mockRepository.save.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.create({ title: 'Test' })).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update a task and publish event', async () => {
      const task = await service.create({ title: 'Task 1', description: 'Description 1' });
      const updateDto = { title: 'Updated Task', description: 'Updated Description' };
      const updated = await service.update(task.id, updateDto);

      expect(updated.title).toBe(updateDto.title);
      expect(updated.description).toBe(updateDto.description);
      expect(mockEventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_UPDATED,
        updated.id,
        updated,
        task
      );
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      await expect(service.update('999', { title: 'Updated' })).rejects.toThrow('Task with ID 999 not found');
    });
  });

  describe('delete', () => {
    it('should soft delete a task and publish event', async () => {
      const task = await service.create({ title: 'Task 1', description: 'Description 1' });
      await service.delete(task.id);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(task.id);
      expect(mockEventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_DELETED,
        task.id,
        expect.objectContaining({ ...task, deletedAt: expect.any(Date) })
      );
    });

    it('should throw NotFoundException when deleting non-existent task', async () => {
      await expect(service.delete('999')).rejects.toThrow('Task with ID 999 not found');
    });
  });

  describe('restore', () => {
    it('should restore a deleted task and publish event', async () => {
      const task = await service.create({ title: 'Task 1', description: 'Description 1' });
      await service.delete(task.id);
      
      const deletedTask = { ...task, deletedAt: new Date() };
      mockRepository.findOne.mockResolvedValueOnce(deletedTask);
      
      const restored = await service.restore(task.id);

      expect(mockRepository.restore).toHaveBeenCalledWith(task.id);
      expect(mockEventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_RESTORED,
        restored.id,
        restored,
        deletedTask
      );
    });

    it('should throw NotFoundException when restoring non-existent task', async () => {
      await expect(service.restore('999')).rejects.toThrow('Task with ID 999 not found');
    });
  });
});
