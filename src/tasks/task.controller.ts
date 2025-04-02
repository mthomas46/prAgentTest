import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from '../entities/task.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks', type: [Task] })
  async findAll(@Query('includeDeleted') includeDeleted = false): Promise<Task[]> {
    return this.taskService.findAll(includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted = false,
  ): Promise<Task> {
    return this.taskService.findOne(id, includeDeleted);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been created', type: Task })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() taskData: Partial<Task>): Promise<Task> {
    return this.taskService.create(taskData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'The task has been updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() taskData: Partial<Task>,
  ): Promise<Task> {
    return this.taskService.update(id, taskData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'The task has been deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.taskService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted task' })
  @ApiResponse({ status: 200, description: 'The task has been restored', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async restore(@Param('id') id: string): Promise<Task> {
    return this.taskService.restore(id);
  }
} 