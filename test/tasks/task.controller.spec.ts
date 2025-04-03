import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../../services/task-service/src/task.controller';
import { TaskService } from '../../services/task-service/src/task.service';
import { Task } from '../../services/task-service/src/task.entity';
import { NotFoundException } from '@nestjs/common';
import { mockTask, mockCreateTaskDto } from '../mocks/task.entity.mock';

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
    it('should update an existing task', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Task' };
      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update({ id: '1', updateTaskDto: { title: 'Updated Task' } });
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when task to update is not found', async () => {
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
      const restoredTask = { ...mockTask, deletedAt: null };
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
