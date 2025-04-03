import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async completeTask(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.completed = true;
    task.status = TaskStatus.COMPLETED;
    return this.taskRepository.save(task);
  }

  async assignTask(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id);
    task.assignedTo = userId;
    return this.taskRepository.save(task);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.find({ where: { status } });
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { assignedTo: userId } });
  }
} 