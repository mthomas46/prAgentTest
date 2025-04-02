import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { Task } from '../../src/entities/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { TaskPriority } from '../../src/entities/task.entity';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    // Clear the tasks table before each test
    const taskRepository = dataSource.getRepository(Task);
    await taskRepository.clear();
  });

  describe('POST /tasks', () => {
    it('should create a task with valid data', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer()).post('/tasks').send(taskData).expect(201);

      expect(response.body).toEqual({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });

      // Verify database state
      const taskRepository = dataSource.getRepository(Task);
      const savedTask = await taskRepository.findOne({ where: { id: taskData.id } });
      expect(savedTask).toBeDefined();
      if (!savedTask) {
        throw new Error('Task not found in database after creation');
      }
      expect(savedTask.title).toBe(taskData.title);
    });

    it.skip('should return 400 for invalid task data', async () => {
      const invalidData = {
        id: uuidv4(),
        title: '', // Empty title
        description: 'Test Description',
        priority: 'INVALID_PRIORITY', // Invalid priority
        dueDate: 'invalid-date', // Invalid date
      };

      await request(app.getHttpServer()).post('/tasks').send(invalidData).expect(400);
    });

    it.skip('should handle duplicate task IDs', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      // Create first task
      await request(app.getHttpServer()).post('/tasks').send(taskData).expect(201);

      // Try to create second task with same ID
      await request(app.getHttpServer()).post('/tasks').send(taskData).expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      // Create multiple tasks
      const tasks = [
        {
          id: uuidv4(),
          title: 'Task 1',
          description: 'Description 1',
          priority: TaskPriority.HIGH,
          dueDate: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Task 2',
          description: 'Description 2',
          priority: TaskPriority.MEDIUM,
          dueDate: new Date().toISOString(),
        },
      ];

      for (const task of tasks) {
        await request(app.getHttpServer()).post('/tasks').send(task).expect(201);
      }

      const response = await request(app.getHttpServer()).get('/tasks').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Task 1',
            priority: TaskPriority.HIGH,
          }),
          expect.objectContaining({
            title: 'Task 2',
            priority: TaskPriority.MEDIUM,
          }),
        ]),
      );
    });

    it('should return empty array when no tasks exist', async () => {
      const response = await request(app.getHttpServer()).get('/tasks').expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a specific task', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      await request(app.getHttpServer()).post('/tasks').send(taskData).expect(201);

      const response = await request(app.getHttpServer()).get(`/tasks/${taskData.id}`).expect(200);

      expect(response.body).toEqual({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = uuidv4();
      await request(app.getHttpServer()).get(`/tasks/${nonExistentId}`).expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it.skip('should update a task', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Original Title',
        description: 'Original Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      await request(app.getHttpServer()).post('/tasks').send(taskData).expect(201);

      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: TaskPriority.MEDIUM,
        completed: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskData.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        id: taskData.id,
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
        dueDate: taskData.dueDate,
        completed: updateData.completed,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = uuidv4();
      const updateData = {
        title: 'Updated Title',
      };

      await request(app.getHttpServer())
        .patch(`/tasks/${nonExistentId}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it.skip('should soft delete a task', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      await request(app.getHttpServer()).post('/tasks').send(taskData).expect(201);

      await request(app.getHttpServer()).delete(`/tasks/${taskData.id}`).expect(200);

      // Verify task is soft deleted
      const taskRepository = dataSource.getRepository(Task);
      const deletedTask = await taskRepository.findOne({
        where: { id: taskData.id },
        withDeleted: true,
      });

      expect(deletedTask).toBeDefined();
      expect(deletedTask?.deletedAt).not.toBeNull();
    });

    it('should return 404 when deleting non-existent task', async () => {
      const nonExistentId = uuidv4();
      await request(app.getHttpServer()).delete(`/tasks/${nonExistentId}`).expect(404);
    });
  });

  describe('POST /tasks/:id/restore', () => {
    it.skip('should restore a soft-deleted task', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      // Create and delete a task
      await request(app.getHttpServer()).post('/tasks').send(taskData).expect(201);

      await request(app.getHttpServer()).delete(`/tasks/${taskData.id}`).expect(200);

      // Restore the task
      const response = await request(app.getHttpServer())
        .post(`/tasks/${taskData.id}/restore`)
        .expect(200);

      expect(response.body).toEqual({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });

      // Verify task is restored in database
      const taskRepository = dataSource.getRepository(Task);
      const restoredTask = await taskRepository.findOne({
        where: { id: taskData.id },
      });

      expect(restoredTask).toBeDefined();
      expect(restoredTask?.deletedAt).toBeNull();
    });

    it('should return 404 when restoring non-existent task', async () => {
      const nonExistentId = uuidv4();
      await request(app.getHttpServer()).post(`/tasks/${nonExistentId}/restore`).expect(404);
    });
  });
});
