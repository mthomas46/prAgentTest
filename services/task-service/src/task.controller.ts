import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { ICreateTaskDto, IUpdateTaskDto } from '../../../shared/interfaces/task.interface';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'createTask' })
  async create(@Payload() createTaskDto: ICreateTaskDto) {
    return await this.taskService.create(createTaskDto);
  }

  @MessagePattern({ cmd: 'findAllTasks' })
  async findAll() {
    return await this.taskService.findAll();
  }

  @MessagePattern({ cmd: 'findOneTask' })
  async findOne(@Payload() id: string) {
    return await this.taskService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateTask' })
  async update(@Payload() payload: { id: string; updateTaskDto: IUpdateTaskDto }) {
    return await this.taskService.update(payload.id, payload.updateTaskDto);
  }

  @MessagePattern({ cmd: 'deleteTask' })
  async delete(@Payload() id: string) {
    return await this.taskService.delete(id);
  }

  @MessagePattern({ cmd: 'restoreTask' })
  async restore(@Payload() id: string) {
    return await this.taskService.restore(id);
  }
} 