import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../services/task-service/src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority } from '../../services/task-service/src/task.entity';
import { TaskStatus } from '../../shared/interfaces/task.interface';
import { mockTask, mockCreateTaskDto } from '../mocks/task.entity.mock';

describe.skip('TaskController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
    await app.init();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(mockCreateTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        ...mockCreateTaskDto,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('/tasks (GET)', () => {
    it('should return an array of tasks', async () => {
      await repository.save(mockTask);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        ...mockTask,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a task by id', async () => {
      const savedTask = await repository.save(mockTask);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${savedTask.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        ...mockTask,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when task is not found', async () => {
      await request(app.getHttpServer())
        .get('/tasks/non-existent-id')
        .expect(404);
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update a task', async () => {
      const savedTask = await repository.save(mockTask);
      const updateData = {
        title: 'Updated Task',
        priority: TaskPriority.LOW,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${savedTask.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        ...mockTask,
        ...updateData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when updating non-existent task', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/non-existent-id')
        .send({ title: 'Updated Task' })
        .expect(404);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should soft delete a task', async () => {
      const savedTask = await repository.save(mockTask);

      await request(app.getHttpServer())
        .delete(`/tasks/${savedTask.id}`)
        .expect(204);

      const deletedTask = await repository.findOne({
        where: { id: savedTask.id },
        withDeleted: true,
      });
      expect(deletedTask.deletedAt).toBeTruthy();
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/non-existent-id')
        .expect(404);
    });
  });

  describe('/tasks/:id/restore (POST)', () => {
    it('should restore a deleted task', async () => {
      const savedTask = await repository.save(mockTask);
      await repository.softDelete(savedTask.id);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${savedTask.id}/restore`)
        .expect(200);

      expect(response.body).toMatchObject({
        ...mockTask,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      });

      const restoredTask = await repository.findOne({
        where: { id: savedTask.id },
      });
      expect(restoredTask.deletedAt).toBeNull();
    });

    it('should return 404 when restoring non-existent task', async () => {
      await request(app.getHttpServer())
        .post('/tasks/non-existent-id/restore')
        .expect(404);
    });
  });
});