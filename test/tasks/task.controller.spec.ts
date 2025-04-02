import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../../src/tasks/task.controller';
import { TaskService } from '../../src/tasks/task.service';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const task = {
        id: 1,
        ...createTaskDto,
        isCompleted: false,
        createdAt: new Date(),
      };

      mockTaskService.create.mockResolvedValue(task);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(task);
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          isCompleted: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          isCompleted: true,
          createdAt: new Date(),
        },
      ];

      mockTaskService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(result).toEqual(tasks);
      expect(mockTaskService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isCompleted: false,
        createdAt: new Date(),
      };

      mockTaskService.findOne.mockResolvedValue(task);

      const result = await controller.findOne(1);

      expect(result).toEqual(task);
      expect(mockTaskService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        isCompleted: true,
        createdAt: new Date(),
      };

      mockTaskService.update.mockResolvedValue(task);

      const result = await controller.update(1, { isCompleted: true });

      expect(result).toEqual(task);
      expect(mockTaskService.update).toHaveBeenCalledWith(1, { isCompleted: true });
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockTaskService.remove).toHaveBeenCalledWith(1);
    });
  });
}); 