import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../../src/controllers/task.controller';
import { TaskService } from '../../src/services/task.service';
import { Task } from '../../src/entities/task.entity';
import { TaskStatus } from '../../src/enums/task-status.enum';
import { TaskPriority } from '../../src/enums/task-priority.enum';
import { CreateTaskDto } from '../../src/dto/create-task.dto';
import { UpdateTaskDto } from '../../src/dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    completed: false,
    assignedTo: null,
    dueDate: null,
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'New Task',
    description: 'New Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
  };

  const mockUpdateTaskDto: UpdateTaskDto = {
    title: 'Updated Task',
    description: 'Updated Description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findAll: jest.fn().mockResolvedValue([mockTask]),
            findOne: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue(mockTask),
            remove: jest.fn().mockResolvedValue(undefined),
            completeTask: jest.fn().mockResolvedValue({ ...mockTask, completed: true }),
            assignTask: jest.fn().mockResolvedValue({ ...mockTask, assignedTo: 'user123' }),
            getTasksByStatus: jest.fn().mockResolvedValue([mockTask]),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const result = await controller.create(mockCreateTaskDto);
      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(mockCreateTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const result = await controller.update(1, mockUpdateTaskDto);
      expect(result).toEqual(mockTask);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('completeTask', () => {
    it('should mark a task as completed', async () => {
      const result = await controller.completeTask(1);
      expect(result).toEqual({ ...mockTask, completed: true });
      expect(service.completeTask).toHaveBeenCalledWith(1);
    });
  });

  describe('assignTask', () => {
    it('should assign a task to a user', async () => {
      const userId = 'user456';
      jest.spyOn(service, 'assignTask').mockResolvedValue({ ...mockTask, assignedTo: userId });
      expect(await controller.assignTask(1, userId)).toEqual({ ...mockTask, assignedTo: userId });
      expect(service.assignTask).toHaveBeenCalledWith(1, userId);
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks by status', async () => {
      jest.spyOn(service, 'getTasksByStatus').mockResolvedValue([mockTask]);
      expect(await controller.getTasksByStatus(TaskStatus.PENDING)).toEqual([mockTask]);
      expect(service.getTasksByStatus).toHaveBeenCalledWith(TaskStatus.PENDING);
    });
  });
}); 