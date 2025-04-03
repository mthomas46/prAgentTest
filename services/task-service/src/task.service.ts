import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventPublisherService } from '../../../shared/services/event-publisher.service';
import { EventType } from '../../../shared/interfaces/events.interface';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create(createTaskDto);
      const savedTask = await this.taskRepository.save(task);
      this.logger.log(`Task created successfully: ${savedTask.id}`);

      // Publish task created event
      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_CREATED,
        savedTask.id,
        savedTask,
      );

      return savedTask;
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository.find();
      this.logger.log(`Found ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      this.logger.error(`Error finding tasks: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      this.logger.log(`Found task: ${id}`);
      return task;
    } catch (error) {
      this.logger.error(`Error finding task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const previousTask = await this.findOne(id);
      const updatedTask = this.taskRepository.merge(previousTask, updateTaskDto);
      const savedTask = await this.taskRepository.save(updatedTask);
      this.logger.log(`Task updated successfully: ${id}`);

      // Publish task updated event
      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_UPDATED,
        id,
        savedTask,
        previousTask,
      );

      // Check if status changed
      if (previousTask.status !== savedTask.status) {
        await this.eventPublisher.publishTaskEvent(
          EventType.TASK_STATUS_CHANGED,
          id,
          savedTask,
          previousTask,
        );
      }

      // Check if task was assigned
      if (previousTask.assignedTo !== savedTask.assignedTo) {
        await this.eventPublisher.publishTaskEvent(
          EventType.TASK_ASSIGNED,
          id,
          savedTask,
          previousTask,
        );
      }

      // Check if task was completed
      if (!previousTask.completed && savedTask.completed) {
        await this.eventPublisher.publishTaskEvent(
          EventType.TASK_COMPLETED,
          id,
          savedTask,
          previousTask,
        );
      }

      return savedTask;
    } catch (error) {
      this.logger.error(`Error updating task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const task = await this.findOne(id);
      await this.taskRepository.remove(task);
      this.logger.log(`Task removed successfully: ${id}`);

      // Publish task deleted event
      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_DELETED,
        id,
        task,
      );
    } catch (error) {
      this.logger.error(`Error removing task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 