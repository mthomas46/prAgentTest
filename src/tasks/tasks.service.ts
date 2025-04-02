import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPriority } from './enums/task-priority.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(includeDeleted = false): Promise<Task[]> {
    if (includeDeleted) {
      return this.taskRepository.find({ withDeleted: true });
    }
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      if (createTaskDto.priority && !Object.values(TaskPriority).includes(createTaskDto.priority)) {
        throw new BadRequestException(`Invalid priority value: ${createTaskDto.priority}`);
      }

      if (createTaskDto.id) {
        const existingTask = await this.taskRepository.findOne({
          where: { id: createTaskDto.id },
        });
        if (existingTask) {
          throw new BadRequestException(`Task with ID "${createTaskDto.id}" already exists`);
        }
      }

      return await this.taskRepository.save(createTaskDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      if (updateTaskDto.priority && !Object.values(TaskPriority).includes(updateTaskDto.priority)) {
        throw new BadRequestException(`Invalid priority value: ${updateTaskDto.priority}`);
      }

      const existingTask = await this.findOne(id);
      const updatedTask = Object.assign(existingTask, updateTaskDto);
      return await this.taskRepository.save(updatedTask);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update task: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.taskRepository.softDelete(id);
  }

  async restore(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    if (!task.deletedAt) {
      throw new BadRequestException(`Task with ID "${id}" is not deleted`);
    }

    await this.taskRepository.restore(id);
    return this.findOne(id);
  }
}
