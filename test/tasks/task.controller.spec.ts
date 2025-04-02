import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../../src/tasks/task.controller';
import { TaskService } from '../../src/tasks/task.service';
import { Task, TaskPriority } from '../../src/entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];
      mockTaskService.findAll.mockResolvedValue(expectedTasks);

      const result = await controller.findAll(false);
      expect(result).toEqual(expectedTasks);
      expect(mockTaskService.findAll).toHaveBeenCalledWith(false);
    });

    it('should include deleted tasks when specified', async () => {
      const deletedTasks = [{ id: '1', title: 'Task 1', deletedAt: new Date() }];
      mockTaskService.findAll.mockResolvedValue(deletedTasks);

      const result = await controller.findAll(true);
      expect(result).toEqual(deletedTasks);
      expect(mockTaskService.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const expectedTask = { id: '1', title: 'Task 1' };
      mockTaskService.findOne.mockResolvedValue(expectedTask);

      const result = await controller.findOne('1', false);
      expect(result).toEqual(expectedTask);
      expect(mockTaskService.findOne).toHaveBeenCalledWith('1', false);
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockTaskService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1', false)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        priority: TaskPriority.HIGH,
      };
      const createdTask = { id: '1', ...taskData };
      mockTaskService.create.mockResolvedValue(createdTask);

      const result = await controller.create(taskData);
      expect(result).toEqual(createdTask);
      expect(mockTaskService.create).toHaveBeenCalledWith(taskData);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const taskId = '1';
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };
      const updatedTask = { id: taskId, ...updateData };
      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateData);
      expect(result).toEqual(updatedTask);
      expect(mockTaskService.update).toHaveBeenCalledWith(taskId, updateData);
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      mockTaskService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', { title: 'Updated Title' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const taskId = '1';
      mockTaskService.remove.mockResolvedValue(undefined);

      await controller.remove(taskId);
      expect(mockTaskService.remove).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException when removing non-existent task', async () => {
      mockTaskService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a deleted task', async () => {
      const taskId = '1';
      const restoredTask = {
        id: taskId,
        title: 'Restored Task',
        deletedAt: null,
      };
      mockTaskService.restore.mockResolvedValue(restoredTask);

      const result = await controller.restore(taskId);
      expect(result).toEqual(restoredTask);
      expect(mockTaskService.restore).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException when restoring non-existent task', async () => {
      mockTaskService.restore.mockRejectedValue(new NotFoundException());

      await expect(controller.restore('1')).rejects.toThrow(NotFoundException);
    });
  });
});
