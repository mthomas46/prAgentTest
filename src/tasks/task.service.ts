import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(includeDeleted = false): Promise<Task[]> {
    return this.taskRepository.find({
      withDeleted: includeDeleted,
    });
  }

  async findOne(id: string, includeDeleted = false): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      withDeleted: includeDeleted,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create({
      ...taskData,
      priority: taskData.priority || TaskPriority.MEDIUM,
    });
    return this.taskRepository.save(task);
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, taskData);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.softDelete(id);
  }

  async restore(id: string): Promise<Task> {
    const task = await this.findOne(id, true);
    await this.taskRepository.restore(id);
    return this.findOne(id);
  }
}
