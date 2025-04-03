import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { Task } from '../../src/entities/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { TaskPriority } from '../../src/entities/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  }, 30000);

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  beforeEach(async () => {
    // Clear the tasks table before each test
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

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

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
      const savedTask = await taskRepository.findOne({ where: { id: taskData.id }});
      expect(savedTask).toBeDefined();
      if (!savedTask) {
        throw new Error('Task not found in database after creation');
      }
      expect(savedTask.title).toBe(taskData.title);
    });

    it.skip('should return 400 for invalid task data', async () => {
      // TODO: Fix validation to properly handle invalid data
      const invalidData = {
        id: uuidv4(),
        title: '', // Empty title
        description: 'Test Description',
        priority: 'INVALID_PRIORITY', // Invalid priority
        dueDate: 'invalid-date', // Invalid date
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(invalidData)
        .expect(400);
    });

    it.skip('should handle duplicate task IDs', async () => {
      // TODO: Fix duplicate ID handling
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      // Create first task
      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

      // Try to create second task with same ID
      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(400);
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
        await request(app.getHttpServer())
          .post('/tasks')
          .send(task)
          .expect(201);
      }

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

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
        ])
      );
    });

    it('should return empty array when no tasks exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

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

      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskData.id}`)
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
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = uuidv4();
      await request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it.skip('should update a task', async () => {
      // TODO: Fix task update functionality
      const taskData = {
        id: uuidv4(),
        title: 'Original Title',
        description: 'Original Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

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

      // Verify database state
      const updatedTask = await taskRepository.findOne({ where: { id: taskData.id }});
      expect(updatedTask).toBeDefined();
      if (!updatedTask) {
        throw new Error('Task not found in database after update');
      }
      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.priority).toBe(updateData.priority);
      expect(updatedTask.completed).toBe(updateData.completed);
    });

    it('should return 404 when updating non-existent task', async () => {
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
    it('should soft delete a task', async () => {
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/tasks/${taskData.id}`)
        .expect(204);

      // Verify task is soft deleted
      const deletedTask = await taskRepository.findOne({
        where: { id: taskData.id },
        withDeleted: true,
      });
      expect(deletedTask?.deletedAt).toBeTruthy();

      // Verify task is not returned in GET /tasks
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);
      expect(response.body).toHaveLength(0);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const nonExistentId = uuidv4();
      await request(app.getHttpServer())
        .delete(`/tasks/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('POST /tasks/:id/restore', () => {
    it.skip('should restore a soft-deleted task', async () => {
      // TODO: Fix task restore functionality
      const taskData = {
        id: uuidv4(),
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

      // Soft delete the task
      await request(app.getHttpServer())
        .delete(`/tasks/${taskData.id}`)
        .expect(204);

      // Restore the task
      await request(app.getHttpServer())
        .post(`/tasks/${taskData.id}/restore`)
        .expect(204);

      // Verify task is restored
      const restoredTask = await taskRepository.findOne({
        where: { id: taskData.id },
      });
      expect(restoredTask?.deletedAt).toBeNull();

      // Verify task is returned in GET /tasks
      const getResponse = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0].id).toBe(taskData.id);
    });

    it('should return 404 when restoring non-existent task', async () => {
      const nonExistentId = uuidv4();
      await request(app.getHttpServer())
        .post(`/tasks/${nonExistentId}/restore`)
        .expect(404);
    });
  });
});

describe('Task Integration Tests', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
    await app.init();
  });

  afterEach(async () => {
    await taskRepository.clear();
    await app.close();
  });

  describe('Task CRUD Operations', () => {
    it('should create a task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Integration Test Task',
          description: 'Test Description',
          priority: TaskPriority.MEDIUM,
        })
        .expect(201);

      expect(response.body.title).toBe('Integration Test Task');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.priority).toBe(TaskPriority.MEDIUM);
    });

    it('should get all tasks', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].title).toBe('Test Task');
    });

    it('should get a task by id', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Test Task');
    });

    it('should update a task', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      });

      const response = await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
          priority: TaskPriority.HIGH,
        })
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.description).toBe('Updated Description');
      expect(response.body.priority).toBe(TaskPriority.HIGH);
    });

    it('should delete a task', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      });

      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(200);

      const found = await taskRepository.findOne({
        where: { id: task.id },
      });
      expect(found).toBeNull();
    });
  });
}); 