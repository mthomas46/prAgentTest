import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from '../../src/services/task.service';
import { Task } from '../../src/entities/task.entity';
import { TaskStatus } from '../../src/enums/task-status.enum';
import { TaskPriority } from '../../src/enums/task-priority.enum';
import { CreateTaskDto } from '../../src/dto/create-task.dto';
import { UpdateTaskDto } from '../../src/dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

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
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn().mockResolvedValue([mockTask]),
            findOne: jest.fn().mockResolvedValue(mockTask),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const result = await service.create(mockCreateTaskDto);
      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith({
        ...mockCreateTaskDto,
        status: TaskStatus.PENDING,
        completed: false,
      });
      expect(repository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTask]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when task is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const result = await service.update(1, mockUpdateTaskDto);
      expect(result).toEqual(mockTask);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockTask,
        ...mockUpdateTaskDto,
      });
    });

    it('should throw NotFoundException when task is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.update(999, mockUpdateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await service.remove(1);
      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException when task is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('completeTask', () => {
    it('should mark a task as completed', async () => {
      const completedTask = {
        ...mockTask,
        completed: true,
        status: TaskStatus.COMPLETED,
      };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(completedTask);

      const result = await service.completeTask(1);
      expect(result).toEqual(completedTask);
      expect(repository.save).toHaveBeenCalledWith(completedTask);
    });

    it('should throw NotFoundException when task is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.completeTask(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignTask', () => {
    it('should assign a task to a user', async () => {
      const userId = 'user123';
      const assignedTask = {
        ...mockTask,
        assignedTo: userId,
      };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(assignedTask);

      const result = await service.assignTask(1, userId);
      expect(result).toEqual(assignedTask);
      expect(repository.save).toHaveBeenCalledWith(assignedTask);
    });

    it('should throw NotFoundException when task is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.assignTask(999, 'user123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks with the specified status', async () => {
      const result = await service.getTasksByStatus(TaskStatus.PENDING);
      expect(result).toEqual([mockTask]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { status: TaskStatus.PENDING },
      });
    });
  });
}); 