import { TaskService } from '../services/task.service';
import Task from '../models/task.model';

// Mock the Task model
jest.mock('../models/task.model');

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    taskService = new TaskService();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
      };

      const mockTask = {
        id: 1,
        ...taskData,
        completed: false,
        assignedTo: null,
        dueDate: null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock the create method
      (Task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask(taskData);

      expect(Task.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          priority: 'medium',
          completed: false,
          assignedTo: null,
          dueDate: null,
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          status: 'completed',
          priority: 'high',
          completed: true,
          assignedTo: 'user1',
          dueDate: new Date(),
          metadata: { tag: 'important' },
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      // Mock the findAll method
      (Task.findAll as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks();

      expect(Task.findAll).toHaveBeenCalledWith({
        where: { deletedAt: null },
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const mockTask = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        priority: 'medium',
        completed: false,
        assignedTo: null,
        dueDate: null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock the findByPk method
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      // Mock the findByPk method to return null
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await taskService.getTaskById(999);

      expect(Task.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const mockTask = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        priority: 'medium',
        completed: false,
        assignedTo: null,
        dueDate: null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        update: jest.fn().mockResolvedValue(true),
      };

      const updateData = {
        title: 'Updated Task',
        status: 'completed',
      };

      // Mock the findByPk method
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.updateTask(1, updateData);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(mockTask.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      // Mock the findByPk method to return null
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await taskService.updateTask(999, { title: 'Updated Task' });

      expect(Task.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockTask = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        priority: 'medium',
        completed: false,
        assignedTo: null,
        dueDate: null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        destroy: jest.fn().mockResolvedValue(true),
      };

      // Mock the findByPk method
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(1);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(mockTask.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if task not found', async () => {
      // Mock the findByPk method to return null
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await taskService.deleteTask(999);

      expect(Task.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBe(false);
    });
  });
}); 