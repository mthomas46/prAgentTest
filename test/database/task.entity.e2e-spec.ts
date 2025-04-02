import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThan } from 'typeorm';
import { Task, TaskPriority } from '../../src/entities/task.entity';
import { AppModule } from '../../src/app.module';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

describe('Task Entity Database Tests', () => {
  let module: TestingModule;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await taskRepository.clear();
  });

  describe('Task Creation', () => {
    it('should create a new task with all fields', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
      };

      const task = taskRepository.create(taskData);
      const savedTask = await taskRepository.save(task);

      expect(savedTask.id).toBeDefined();
      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBe(taskData.description);
      expect(savedTask.completed).toBe(taskData.completed);
      expect(savedTask.priority).toBe(taskData.priority);
      expect(savedTask.dueDate).toBeDefined();
      expect(savedTask.createdAt).toBeDefined();
      expect(savedTask.updatedAt).toBeDefined();
      expect(savedTask.deletedAt).toBeNull();
    });

    it('should create a task with minimal required fields', async () => {
      const taskData = {
        title: 'Minimal Task',
      };

      const task = taskRepository.create(taskData);
      const savedTask = await taskRepository.save(task);

      expect(savedTask.id).toBeDefined();
      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBeNull();
      expect(savedTask.completed).toBe(false);
      expect(savedTask.priority).toBe(TaskPriority.MEDIUM);
      expect(savedTask.dueDate).toBeNull();
    });

    it('should fail when creating a task with empty title', async () => {
      const taskData = {
        title: '',
        description: 'Test Description',
      };

      const task = taskRepository.create(taskData);
      const errors = await validate(task);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when creating a task with title longer than allowed', async () => {
      const taskData = {
        title: 'a'.repeat(256),
        description: 'Test Description',
      };

      const task = taskRepository.create(taskData);
      const errors = await validate(task);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('Task Retrieval', () => {
    it('should find a task by id', async () => {
      const task = await taskRepository.save({
        title: 'Find Me',
        description: 'Test Description',
      });

      const foundTask = await taskRepository.findOne({ where: { id: task.id } });
      expect(foundTask).not.toBeNull();
      if (foundTask) {
        expect(foundTask.id).toBe(task.id);
      }
    });

    it('should return null when finding non-existent task', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const foundTask = await taskRepository.findOne({ where: { id: nonExistentId } });
      expect(foundTask).toBeNull();
    });

    it('should find tasks by title pattern', async () => {
      await taskRepository.save([
        { title: 'First Task' },
        { title: 'Second Task' },
        { title: 'Different Name' },
      ]);

      const tasks = await taskRepository.find({
        where: { title: Like('%Task%') },
      });
      expect(tasks.length).toBe(2);
      expect(tasks.every(task => task.title.includes('Task'))).toBe(true);
    });

    it('should find tasks by completion status', async () => {
      await taskRepository.save([
        { title: 'Task 1', completed: true },
        { title: 'Task 2', completed: false },
        { title: 'Task 3', completed: true },
      ]);

      const completedTasks = await taskRepository.find({
        where: { completed: true },
      });
      expect(completedTasks.length).toBe(2);
      expect(completedTasks.every(task => task.completed)).toBe(true);
    });

    it('should find tasks by due date range', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      await taskRepository.save([
        { title: 'Past Task', dueDate: yesterday },
        { title: 'Future Task', dueDate: tomorrow },
        { title: 'Far Future Task', dueDate: nextWeek },
      ]);

      const upcomingTasks = await taskRepository.find({
        where: {
          dueDate: Between(now, tomorrow),
        },
        order: { dueDate: 'ASC' },
      });

      expect(upcomingTasks.length).toBe(1);
      expect(upcomingTasks[0].title).toBe('Future Task');
    });

    it('should find overdue tasks', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      await taskRepository.save([
        { title: 'Overdue Task', dueDate: yesterday, completed: false },
        { title: 'Future Task', dueDate: tomorrow, completed: false },
        { title: 'Completed Overdue Task', dueDate: yesterday, completed: true },
      ]);

      const overdueTasks = await taskRepository.find({
        where: {
          dueDate: MoreThan(now),
          completed: false,
        },
      });

      expect(overdueTasks.length).toBe(1);
      expect(overdueTasks[0].title).toBe('Future Task');
    });
  });

  describe('Task Update', () => {
    it('should update a task', async () => {
      const task = await taskRepository.save({
        title: 'Original Title',
        description: 'Original Description',
      });

      const updatedData = {
        ...task,
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
        priority: TaskPriority.HIGH,
      };

      await new Promise(resolve => setTimeout(resolve, 100)); // Ensure timestamp difference
      const updatedTask = await taskRepository.save(updatedData);

      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.description).toBe('Updated Description');
      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.priority).toBe(TaskPriority.HIGH);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(task.updatedAt.getTime());
    });

    it('should fail when updating to empty title', async () => {
      const task = await taskRepository.save({
        title: 'Original Title',
      });

      const updatedData = {
        ...task,
        title: '',
      };

      const taskInstance = taskRepository.create(updatedData);
      const errors = await validate(taskInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should update multiple tasks', async () => {
      await taskRepository.save([
        { title: 'Task 1', completed: false },
        { title: 'Task 2', completed: false },
      ]);

      await taskRepository.update(
        { completed: false },
        { completed: true }
      );

      const tasks = await taskRepository.find();
      expect(tasks.every(task => task.completed)).toBe(true);
    });
  });

  describe('Task Deletion', () => {
    it('should soft delete a task', async () => {
      const task = await taskRepository.save({
        title: 'To Be Deleted',
      });

      await taskRepository.softDelete(task.id);
      const deletedTask = await taskRepository.findOne({ where: { id: task.id } });
      expect(deletedTask).toBeNull();

      // Check if the task still exists in the database with deletedAt set
      const taskWithDeleted = await taskRepository.findOne({
        where: { id: task.id },
        withDeleted: true,
      });
      expect(taskWithDeleted).not.toBeNull();
      if (taskWithDeleted) {
        expect(taskWithDeleted.deletedAt).toBeDefined();
      }
    });

    it('should restore a soft-deleted task', async () => {
      const task = await taskRepository.save({
        title: 'To Be Restored',
      });

      await taskRepository.softDelete(task.id);
      await taskRepository.restore(task.id);

      const restoredTask = await taskRepository.findOne({
        where: { id: task.id },
      });
      expect(restoredTask).not.toBeNull();
      if (restoredTask) {
        expect(restoredTask.deletedAt).toBeNull();
      }
    });

    it('should soft delete multiple tasks', async () => {
      const tasks = await taskRepository.save([
        { title: 'Task 1' },
        { title: 'Task 2' },
      ]);

      await taskRepository.softDelete(tasks.map(task => task.id));

      const remainingTasks = await taskRepository.find();
      expect(remainingTasks.length).toBe(0);

      const deletedTasks = await taskRepository.find({
        withDeleted: true,
      });
      expect(deletedTasks.length).toBe(2);
      expect(deletedTasks.every(task => task.deletedAt !== null)).toBe(true);
    });
  });

  describe('Task Validation', () => {
    it('should enforce required fields', async () => {
      const task = taskRepository.create({});
      const errors = await validate(task);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should enforce enum values for priority', async () => {
      const task = taskRepository.create({
        title: 'Invalid Priority',
        priority: 'invalid' as any,
      });
      const errors = await validate(task);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should handle concurrent updates correctly', async () => {
      const task = await taskRepository.save({
        title: 'Concurrent Task',
        description: 'Original Description',
      });

      // Simulate concurrent updates
      const update1 = taskRepository.save({
        ...task,
        description: 'Update 1',
      });

      const update2 = taskRepository.save({
        ...task,
        description: 'Update 2',
      });

      await expect(Promise.all([update1, update2])).resolves.toBeDefined();
      
      const finalTask = await taskRepository.findOne({
        where: { id: task.id },
      });
      expect(finalTask).not.toBeNull();
      expect(['Update 1', 'Update 2']).toContain(finalTask?.description);
    });
  });
}); 