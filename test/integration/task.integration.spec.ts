import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getConnection } from 'typeorm';
import { Task, TaskPriority } from '../../src/entities/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Task Integration Tests (e2e)', () => {
  let app: INestApplication;
  let taskId: string;

  beforeAll(async () => {
    // Run Liquibase update
    await execAsync('npm run liquibase:update');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Run Liquibase rollback
    await execAsync('npm run liquibase:rollback');
    await app.close();
  });

  describe('Task CRUD Operations with Database Verification', () => {
    it('should create a task and verify database state', async () => {
      const taskData = {
        title: 'Integration Test Task',
        description: 'Testing with database verification',
        priority: 'HIGH',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(201);

      taskId = response.body.id;

      // Verify database state
      const connection = getConnection();
      const taskRepository = connection.getRepository(Task);
      const savedTask = await taskRepository.findOne({ where: { id: taskId } });

      expect(savedTask).toBeDefined();
      if (!savedTask) {
        throw new Error('Task not found in database after creation');
      }

      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBe(taskData.description);
      expect(savedTask.priority).toBe(TaskPriority.HIGH);
    });

    it('should update a task and verify database state', async () => {
      const updateData = {
        title: 'Updated Integration Test Task',
        completed: true,
      };

      await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      // Verify database state
      const connection = getConnection();
      const taskRepository = connection.getRepository(Task);
      const updatedTask = await taskRepository.findOne({ where: { id: taskId } });

      expect(updatedTask).toBeDefined();
      if (!updatedTask) {
        throw new Error('Task not found in database after update');
      }

      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.completed).toBe(updateData.completed);
    });

    it('should soft delete a task and verify database state', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(200);

      // Verify database state
      const connection = getConnection();
      const taskRepository = connection.getRepository(Task);
      const deletedTask = await taskRepository.findOne({
        where: { id: taskId },
        withDeleted: true,
      });

      expect(deletedTask).toBeDefined();
      if (!deletedTask) {
        throw new Error('Task not found in database after deletion');
      }

      expect(deletedTask.deletedAt).toBeDefined();
    });

    it('should restore a deleted task and verify database state', async () => {
      await request(app.getHttpServer())
        .post(`/tasks/${taskId}/restore`)
        .expect(200);

      // Verify database state
      const connection = getConnection();
      const taskRepository = connection.getRepository(Task);
      const restoredTask = await taskRepository.findOne({ where: { id: taskId } });

      expect(restoredTask).toBeDefined();
      if (!restoredTask) {
        throw new Error('Task not found in database after restoration');
      }

      expect(restoredTask.deletedAt).toBeNull();
    });

    it('should handle concurrent operations correctly', async () => {
      const taskIds: string[] = [];

      // Create multiple tasks concurrently
      const createPromises = Array(5).fill(null).map(async () => {
        const response = await request(app.getHttpServer())
          .post('/tasks')
          .send({
            title: `Concurrent Task ${uuidv4()}`,
            description: 'Testing concurrent operations',
            priority: 'MEDIUM',
          });
        taskIds.push(response.body.id);
      });

      await Promise.all(createPromises);

      // Verify all tasks were created
      const connection = getConnection();
      const taskRepository = connection.getRepository(Task);
      const savedTasks = await taskRepository.findByIds(taskIds);

      expect(savedTasks).toHaveLength(taskIds.length);

      // Clean up created tasks
      const deletePromises = taskIds.map(id =>
        request(app.getHttpServer()).delete(`/tasks/${id}`),
      );
      await Promise.all(deletePromises);
    });
  });
}); 