import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../../services/task-service/src/task.controller';
import { TaskService } from '../../services/task-service/src/task.service';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus, TaskPriority } from '../../shared/interfaces/task.interface';

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

// Simplified Task interface for testing
interface TestTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  metadata?: Record<string, any>;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const mockTask: TestTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  assignedTo: 'user1',
  dueDate: new Date(),
  metadata: {},
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined
};

const mockCreateTaskDto = {
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  assignedTo: 'user1',
  dueDate: new Date(),
  metadata: {},
  completed: false
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [mockTask];
      mockTaskService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockTaskService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockTaskService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      mockTaskService.create.mockResolvedValue(mockTask);

      const result = await controller.create(mockCreateTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
      };
      const task = {
        id: '1',
        title: 'Updated Task',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTaskService.update.mockResolvedValue(task);

      expect(await controller.update({ id: '1', updateTaskDto })).toBe(task);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTaskService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update({ id: '1', updateTaskDto: { title: 'Updated Task' } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockTaskService.delete.mockResolvedValue(undefined);

      await controller.delete('1');
      expect(mockTaskService.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when task to delete is not found', async () => {
      mockTaskService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a deleted task', async () => {
      const restoredTask = { ...mockTask, deletedAt: undefined };
      mockTaskService.restore.mockResolvedValue(restoredTask);

      const result = await controller.restore('1');
      expect(result).toEqual(restoredTask);
    });

    it('should throw NotFoundException when task to restore is not found', async () => {
      mockTaskService.restore.mockRejectedValue(new NotFoundException());

      await expect(controller.restore('1')).rejects.toThrow(NotFoundException);
    });
  });
});
