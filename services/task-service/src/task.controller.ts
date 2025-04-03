import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'createTask' })
  async create(@Payload() createTaskDto: CreateTaskDto) {
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
  async update(@Payload() payload: { id: string; updateTaskDto: UpdateTaskDto }) {
    return await this.taskService.update(payload.id, payload.updateTaskDto);
  }

  @MessagePattern({ cmd: 'removeTask' })
  async remove(@Payload() id: string) {
    return await this.taskService.remove(id);
  }
} 