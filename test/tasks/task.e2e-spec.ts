import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Task } from '../../src/entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await taskRepository.clear();
  });

  describe('Task CRUD Operations', () => {
    it('/tasks (POST)', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Task');
          expect(res.body.description).toBe('Test Description');
          expect(res.body.completed).toBe(false);
          expect(res.body.priority).toBe('medium');
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
        });
    });

    it('/tasks (GET)', async () => {
      // Create a test task first
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });

      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0].title).toBe('Test Task');
          expect(res.body[0].description).toBe('Test Description');
          expect(res.body[0].completed).toBe(false);
          expect(res.body[0].priority).toBe('medium');
        });
    });

    it('/tasks/:id (GET)', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });

      return request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(task.id);
          expect(res.body.title).toBe('Test Task');
          expect(res.body.description).toBe('Test Description');
          expect(res.body.completed).toBe(false);
          expect(res.body.priority).toBe('medium');
        });
    });

    it('/tasks/:id (PUT)', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });

      return request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
          completed: true,
          priority: 'high',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(task.id);
          expect(res.body.title).toBe('Updated Task');
          expect(res.body.description).toBe('Updated Description');
          expect(res.body.completed).toBe(true);
          expect(res.body.priority).toBe('high');
        });
    });

    it('/tasks/:id (DELETE)', async () => {
      const task = await taskRepository.save({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });

      await request(app.getHttpServer()).delete(`/tasks/${task.id}`).expect(200);

      const deletedTask = await taskRepository.findOne({
        where: { id: task.id },
        withDeleted: true,
      });
      expect(deletedTask).not.toBeNull();
      if (deletedTask) {
        expect(deletedTask.deletedAt).toBeDefined();
      }
    });
  });
});
