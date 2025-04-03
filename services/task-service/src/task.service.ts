import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { ICreateTaskDto, IUpdateTaskDto } from '../../../shared/interfaces/task.interface';
import { EventPublisherService } from '../../../shared/services/event-publisher.service';
import { EventType } from '../../../shared/interfaces/events.interface';
import { TaskStatus } from '../../../shared/enums/task-status.enum';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly eventPublisher: EventPublisherService,
  ) {}

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

  async findOne(id: string, includeDeleted = false): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ 
        where: { id },
        withDeleted: includeDeleted
      });
      if (!task) {
        this.logger.error(`Task with ID ${id} not found`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      this.logger.log(`Found task: ${id}`);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createTaskDto: ICreateTaskDto): Promise<Task> {
    try {
      // Ensure status is a valid enum value
      if (createTaskDto.status && !Object.values(TaskStatus).includes(createTaskDto.status)) {
        throw new BadRequestException(`Invalid status value. Valid values are: ${Object.values(TaskStatus).join(', ')}`);
      }

      const task = this.taskRepository.create({
        ...createTaskDto,
        status: createTaskDto.status || TaskStatus.PENDING,
      });

      const savedTask = await this.taskRepository.save(task);
      this.logger.log(`Task created successfully: ${savedTask.id}`);

      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_CREATED,
        savedTask.id,
        savedTask
      );

      return savedTask;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error creating task: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateTaskDto: IUpdateTaskDto): Promise<Task> {
    try {
      // Ensure status is a valid enum value if provided
      if (updateTaskDto.status && !Object.values(TaskStatus).includes(updateTaskDto.status)) {
        throw new BadRequestException(`Invalid status value. Valid values are: ${Object.values(TaskStatus).join(', ')}`);
      }

      const previousTask = await this.findOne(id);
      const updatedTask = await this.taskRepository.save({
        ...previousTask,
        ...updateTaskDto,
      });
      this.logger.log(`Task updated successfully: ${id}`);

      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_UPDATED,
        updatedTask.id,
        updatedTask,
        previousTask
      );

      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error updating task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const task = await this.findOne(id);
      await this.taskRepository.softDelete(id);
      this.logger.log(`Task deleted successfully: ${id}`);

      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_DELETED,
        task.id,
        { ...task, deletedAt: new Date() }
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async restore(id: string): Promise<Task> {
    try {
      const task = await this.findOne(id, true);
      if (!task.deletedAt) {
        throw new BadRequestException('Task is not deleted');
      }
      await this.taskRepository.restore(id);
      const restoredTask = await this.findOne(id);
      this.logger.log(`Task restored successfully: ${id}`);

      await this.eventPublisher.publishTaskEvent(
        EventType.TASK_RESTORED,
        restoredTask.id,
        restoredTask,
        task
      );

      return restoredTask;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error restoring task ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 