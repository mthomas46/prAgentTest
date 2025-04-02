import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from '../../src/tasks/task.service';
import { Task, TaskPriority } from '../../src/entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];
      mockRepository.find.mockResolvedValue(expectedTasks);

      const result = await service.findAll();
      expect(result).toEqual(expectedTasks);
      expect(mockRepository.find).toHaveBeenCalledWith({
        withDeleted: false,
      });
    });

    it('should include deleted tasks when specified', async () => {
      await service.findAll(true);
      expect(mockRepository.find).toHaveBeenCalledWith({
        withDeleted: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const expectedTask = { id: '1', title: 'Task 1' };
      mockRepository.findOne.mockResolvedValue(expectedTask);

      const result = await service.findOne('1');
      expect(result).toEqual(expectedTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        withDeleted: false,
      });
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should include deleted tasks when specified', async () => {
      const deletedTask = { id: '1', title: 'Deleted Task', deletedAt: new Date() };
      mockRepository.findOne.mockResolvedValue(deletedTask);

      const result = await service.findOne('1', true);
      expect(result).toEqual(deletedTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        withDeleted: true,
      });
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData: Partial<Task> = {
        title: 'New Task',
        description: 'Description',
      };
      const createdTask = { id: '1', ...taskData, priority: TaskPriority.MEDIUM };

      mockRepository.create.mockReturnValue(createdTask);
      mockRepository.save.mockResolvedValue(createdTask);

      const result = await service.create(taskData);
      expect(result).toEqual(createdTask);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...taskData,
        priority: TaskPriority.MEDIUM,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdTask);
    });

    it('should use provided priority when specified', async () => {
      const taskData: Partial<Task> = {
        title: 'New Task',
        priority: TaskPriority.HIGH,
      };
      const createdTask = { id: '1', ...taskData };

      mockRepository.create.mockReturnValue(createdTask);
      mockRepository.save.mockResolvedValue(createdTask);

      const result = await service.create(taskData);
      expect(result.priority).toBe(TaskPriority.HIGH);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const existingTask = {
        id: '1',
        title: 'Old Title',
        description: 'Old Description',
      };
      const updateData: Partial<Task> = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const updatedTask = { ...existingTask, ...updateData };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update('1', updateData);
      expect(result).toEqual(updatedTask);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTask);
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', { title: 'Updated Title' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a task', async () => {
      const task = { id: '1', title: 'Task to Delete' };
      mockRepository.findOne.mockResolvedValue(task);

      await service.remove('1');
      expect(mockRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when deleting non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a deleted task', async () => {
      const deletedTask = {
        id: '1',
        title: 'Deleted Task',
        deletedAt: new Date(),
      };
      const restoredTask = { ...deletedTask, deletedAt: null };

      mockRepository.findOne.mockResolvedValueOnce(deletedTask).mockResolvedValueOnce(restoredTask);

      const result = await service.restore('1');
      expect(result).toEqual(restoredTask);
      expect(mockRepository.restore).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when restoring non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.restore('1')).rejects.toThrow(NotFoundException);
    });
  });
});
