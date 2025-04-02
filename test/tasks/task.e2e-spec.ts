import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../src/entities/task.entity';
import { DataSource } from 'typeorm';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'pr_agent_test',
          entities: [Task],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  beforeEach(async () => {
    // Clear the database before each test
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Task');
        expect(res.body.description).toBe('Test Description');
        expect(res.body.isCompleted).toBe(false);
        expect(res.body).toHaveProperty('createdAt');
      });
  });

  it('/tasks (GET)', async () => {
    // First create a task
    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
      });

    // Then get all tasks
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('title');
        expect(res.body[0]).toHaveProperty('description');
        expect(res.body[0]).toHaveProperty('isCompleted');
        expect(res.body[0]).toHaveProperty('createdAt');
      });
  });

  it('/tasks/:id (GET)', async () => {
    // First create a task
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
      });

    const taskId = createResponse.body.id;

    // Then get the specific task
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(taskId);
        expect(res.body.title).toBe('Test Task');
        expect(res.body.description).toBe('Test Description');
        expect(res.body.isCompleted).toBe(false);
        expect(res.body).toHaveProperty('createdAt');
      });
  });

  it('/tasks/:id (PUT)', async () => {
    // First create a task
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
      });

    const taskId = createResponse.body.id;

    // Then update the task
    return request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        description: 'Updated Description',
        isCompleted: true,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(taskId);
        expect(res.body.title).toBe('Updated Task');
        expect(res.body.description).toBe('Updated Description');
        expect(res.body.isCompleted).toBe(true);
      });
  });

  it('/tasks/:id (DELETE)', async () => {
    // First create a task
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
      });

    const taskId = createResponse.body.id;

    // Then delete the task
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .expect(200);

    // Verify the task is deleted
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(404);
  });
}); 