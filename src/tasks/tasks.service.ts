import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Task, TaskPriority } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(includeDeleted = false): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = {};
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    return this.tasksRepository.find({ where });
  }

  async findOne(id: string, includeDeleted = false): Promise<Task> {
    const where: FindOptionsWhere<Task> = { id };
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    const task = await this.tasksRepository.findOne({ where });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Check if task with this ID already exists
    if (createTaskDto.id) {
      const existingTask = await this.tasksRepository.findOne({
        where: { id: createTaskDto.id },
        withDeleted: true,
      });
      if (existingTask) {
        throw new BadRequestException(`Task with ID ${createTaskDto.id} already exists`);
      }
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
    });

    try {
      return await this.tasksRepository.save(task);
    } catch (error) {
      if (error.message.includes('invalid input value for enum task_priority')) {
        throw new BadRequestException(
          `Invalid priority value. Valid values are: ${Object.values(TaskPriority).join(', ')}`,
        );
      }
      if (error.message.includes('duplicate key value violates unique constraint')) {
        throw new BadRequestException(`Task with ID ${createTaskDto.id} already exists`);
      }
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  async update(id: string, createTaskDto: CreateTaskDto): Promise<Task> {
    // First check if the task exists
    const existingTask = await this.tasksRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (existingTask.deletedAt) {
      throw new BadRequestException(`Task with ID ${id} is deleted`);
    }

    const updateData = {
      ...existingTask,
      ...createTaskDto,
      priority: createTaskDto.priority || existingTask.priority,
    };

    try {
      return await this.tasksRepository.save(updateData);
    } catch (error) {
      if (error.message.includes('invalid input value for enum task_priority')) {
        throw new BadRequestException(
          `Invalid priority value. Valid values are: ${Object.values(TaskPriority).join(', ')}`,
        );
      }
      throw new BadRequestException('Failed to update task: ' + error.message);
    }
  }

  async remove(id: string): Promise<Task> {
    const task = await this.findOne(id);
    await this.tasksRepository.softDelete(id);
    return task;
  }

  async restore(id: string): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (!task.deletedAt) {
      throw new BadRequestException(`Task with ID ${id} is not deleted`);
    }

    await this.tasksRepository.restore(id);
  }
}
