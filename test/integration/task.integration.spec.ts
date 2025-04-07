/// <reference types="jest" />

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../services/task-service/src/entities/task.entity';
import { EventPublisherService } from '../../shared/services/event-publisher.service';
import { EventType } from '../../shared/interfaces/events.interface';
import { TaskStatus } from '../../shared/enums/task-status.enum';
import { TaskModule } from '../../services/task-service/src/task.module';
import { TaskController } from '../../services/task-service/src/task.controller';
import { TaskService } from '../../services/task-service/src/task.service';
import { DataSource } from 'typeorm';
import { testDatabaseConfig } from '../test-database.config';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let eventPublisher: EventPublisherService;
  let dataSource: DataSource;

  const mockEventPublisher = {
    publishTaskEvent: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeAll(async () => {
    // Initialize the database connection
    dataSource = new DataSource({
      ...testDatabaseConfig,
      migrations: ['src/migrations/*.ts'],
      migrationsRun: true,
    });
    await dataSource.initialize();
    await dataSource.runMigrations();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          migrations: ['src/migrations/*.ts'],
          migrationsRun: false, // We already ran migrations
        }),
        TypeOrmModule.forFeature([Task]),
      ],
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: EventPublisherService,
          useValue: mockEventPublisher,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    eventPublisher = moduleFixture.get<EventPublisherService>(EventPublisherService);
    await app.init();
  });

  beforeEach(async () => {
    // Clear all data before each test
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
    // Reset mock calls
    mockEventPublisher.publishTaskEvent.mockClear();
  });

  afterAll(async () => {
    // Clean up
    await dataSource.destroy();
    await app.close();
  });

  describe('/tasks (GET)', () => {
    it('should return all non-deleted tasks', async () => {
      // Create tasks
      const task1 = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 1', description: 'Description 1' })
        .expect(201);

      const task2 = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 2', description: 'Description 2' })
        .expect(201);

      // Delete first task
      await request(app.getHttpServer())
        .delete(`/tasks/${task1.body.id}`)
        .expect(200);

      // Get all tasks
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(task2.body.id);
      expect(response.body[0].title).toBe('Task 2');
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a task by id', async () => {
      // Create a task
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 1', description: 'Description 1' })
        .expect(201);

      // Get the task
      const response = await request(app.getHttpServer())
        .get(`/tasks/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.title).toBe('Task 1');
      expect(response.body.description).toBe('Description 1');
    });

    it('should return 404 when task not found', async () => {
      await request(app.getHttpServer())
        .get('/tasks/999')
        .expect(404);
    });
  });

  describe('/tasks (POST)', () => {
    it('should create a task and publish event', async () => {
      const taskDto = { 
        title: 'New Task', 
        description: 'New Description',
        status: TaskStatus.PENDING,
        assignedTo: 'user1',
        dueDate: new Date().toISOString(),
        metadata: { priority: 'high' }
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(taskDto)
        .expect(201);

      expect(response.body.title).toBe(taskDto.title);
      expect(response.body.description).toBe(taskDto.description);
      expect(response.body.status).toBe(taskDto.status);
      expect(response.body.assignedTo).toBe(taskDto.assignedTo);
      expect(response.body.metadata).toEqual(taskDto.metadata);

      expect(eventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_CREATED,
        response.body.id,
        expect.objectContaining({
          title: taskDto.title,
          description: taskDto.description
        })
      );
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update a task and publish event', async () => {
      // Create a task
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 1', description: 'Description 1' })
        .expect(201);

      const updateDto = { 
        title: 'Updated Task', 
        description: 'Updated Description',
        status: TaskStatus.IN_PROGRESS
      };

      // Update the task
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createResponse.body.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.title).toBe(updateDto.title);
      expect(response.body.description).toBe(updateDto.description);
      expect(response.body.status).toBe(updateDto.status);

      expect(eventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_UPDATED,
        response.body.id,
        expect.objectContaining(updateDto),
        expect.objectContaining({
          title: 'Task 1',
          description: 'Description 1'
        })
      );
    });

    it('should return 404 when task not found', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/999')
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should soft delete a task and publish event', async () => {
      // Create a task
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 1', description: 'Description 1' })
        .expect(201);

      // Delete the task
      await request(app.getHttpServer())
        .delete(`/tasks/${createResponse.body.id}`)
        .expect(200);

      // Verify task is soft deleted
      const response = await request(app.getHttpServer())
        .get(`/tasks/${createResponse.body.id}`)
        .expect(404);

      expect(eventPublisher.publishTaskEvent).toHaveBeenCalledWith(
        EventType.TASK_DELETED,
        createResponse.body.id,
        expect.objectContaining({
          title: 'Task 1',
          description: 'Description 1'
        })
      );
    });

    it('should return 404 when task not found', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/999')
        .expect(404);
    });
  });

  describe('/tasks/:id/restore (POST)', () => {
    it('should restore a soft deleted task and publish event', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 1', description: 'Description 1' });

      await request(app.getHttpServer())
        .delete(`/tasks/${createResponse.body.id}`);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${createResponse.body.id}/restore`)
        .expect(200);

      expect(response.body.title).toBe('Task 1');
      expect(response.body.description).toBe('Description 1');

      // Verify the event publishing sequence
      expect(mockEventPublisher.publishTaskEvent).toHaveBeenCalledTimes(3);
      
      const calls = mockEventPublisher.publishTaskEvent.mock.calls;

      // First call: TASK_CREATED
      expect(calls[0][0]).toBe(EventType.TASK_CREATED);
      expect(calls[0][1]).toBe(createResponse.body.id);
      expect(calls[0][2]).toMatchObject({
        title: 'Task 1',
        description: 'Description 1',
        deletedAt: null
      });

      // Second call: TASK_DELETED
      expect(calls[1][0]).toBe(EventType.TASK_DELETED);
      expect(calls[1][1]).toBe(createResponse.body.id);
      expect(calls[1][2]).toMatchObject({
        title: 'Task 1',
        description: 'Description 1'
      });
      expect(calls[1][2].deletedAt).toBeTruthy();

      // Third call: TASK_RESTORED
      expect(calls[2][0]).toBe(EventType.TASK_RESTORED);
      expect(calls[2][1]).toBe(createResponse.body.id);
      expect(calls[2][2]).toMatchObject({
        title: 'Task 1',
        description: 'Description 1',
        deletedAt: null
      });
      expect(calls[2][3]).toMatchObject({
        title: 'Task 1',
        description: 'Description 1'
      });
      expect(calls[2][3].deletedAt).toBeTruthy();
    });

    it('should return 404 when task not found', async () => {
      await request(app.getHttpServer())
        .post('/tasks/999/restore')
        .expect(404);
    });
  });
});