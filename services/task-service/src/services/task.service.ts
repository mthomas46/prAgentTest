import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto, TaskStatus } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, {
      ...updateTaskDto,
      updatedAt: new Date(),
    });
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async completeTask(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.status = TaskStatus.COMPLETED;
    task.updatedAt = new Date();
    return this.taskRepository.save(task);
  }

  async assignTask(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id);
    task.assignedTo = userId;
    task.status = TaskStatus.IN_PROGRESS;
    task.updatedAt = new Date();
    return this.taskRepository.save(task);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { status: status as TaskStatus },
    });
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { assignedTo: userId },
    });
  }
} 