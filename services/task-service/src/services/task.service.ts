import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: createTaskDto.status ?? TaskStatus.PENDING,
      completed: createTaskDto.completed ?? false,
    });
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const updatedTask = Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(updatedTask);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.findOne(id);
    task.completed = true;
    task.status = TaskStatus.COMPLETED;
    return await this.taskRepository.save(task);
  }

  async assignTask(id: number, userId: string): Promise<Task> {
    const task = await this.findOne(id);
    task.assignedTo = userId;
    return await this.taskRepository.save(task);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return await this.taskRepository.find({ where: { status } });
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { assignedTo: userId } });
  }
} 