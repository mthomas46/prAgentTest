import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Task, TaskPriority } from '../../src/entities/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TaskController (e2e)', () => {
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

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Test Task');
        expect(res.body.description).toBe('Test Description');
        expect(res.body.priority).toBe(TaskPriority.MEDIUM);
      });
  });

  it('/tasks (GET)', async () => {
    const task = await taskRepository.save({
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.MEDIUM,
    });

    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].title).toBe('Test Task');
      });
  });

  it('/tasks/:id (GET)', async () => {
    const task = await taskRepository.save({
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.MEDIUM,
    });

    return request(app.getHttpServer())
      .get(`/tasks/${task.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(task.id);
        expect(res.body.title).toBe('Test Task');
      });
  });

  it('/tasks/:id (PUT)', async () => {
    const task = await taskRepository.save({
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.MEDIUM,
    });

    return request(app.getHttpServer())
      .put(`/tasks/${task.id}`)
      .send({
        title: 'Updated Task',
        description: 'Updated Description',
        priority: TaskPriority.HIGH,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(task.id);
        expect(res.body.title).toBe('Updated Task');
        expect(res.body.description).toBe('Updated Description');
        expect(res.body.priority).toBe(TaskPriority.HIGH);
      });
  });

  it('/tasks/:id (DELETE)', async () => {
    const task = await taskRepository.save({
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.MEDIUM,
    });

    await request(app.getHttpServer()).delete(`/tasks/${task.id}`).expect(200);

    const found = await taskRepository.findOne({
      where: { id: task.id },
    });
    expect(found).toBeNull();
  });
});
