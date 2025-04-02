import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Task } from '../entities/task.entity';
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
    try {
      const task = this.tasksRepository.create(createTaskDto);
      return await this.tasksRepository.save(task);
    } catch (error) {
      throw new BadRequestException('Failed to create task');
    }
  }

  async update(id: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      await this.findOne(id);
      await this.tasksRepository.update(id, createTaskDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update task');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.tasksRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete task');
    }
  }

  async restore(id: string): Promise<Task> {
    try {
      await this.tasksRepository.restore(id);
      return this.findOne(id, true);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to restore task');
    }
  }
} 