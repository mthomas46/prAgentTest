import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskService: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(@Body() createTaskDto: any) {
    return this.taskService.send({ cmd: 'createTask' }, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  async findAll() {
    return this.taskService.send({ cmd: 'findAllTasks' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task' })
  async findOne(@Param('id') id: string) {
    return this.taskService.send({ cmd: 'findOneTask' }, { id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.taskService.send({ cmd: 'removeTask' }, { id });
  }
} 