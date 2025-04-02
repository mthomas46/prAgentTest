import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean, description: 'Include soft-deleted tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks', type: [Task] })
  findAll(@Query('includeDeleted') includeDeleted = false): Promise<Task[]> {
    return this.tasksService.findAll(includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean, description: 'Include soft-deleted tasks' })
  @ApiResponse({ status: 200, description: 'Return a task by id', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted = false,
  ): Promise<Task> {
    return this.tasksService.findOne(id, includeDeleted);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been created', type: Task })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'The task has been updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.update(id, createTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 204, description: 'The task has been deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 201, description: 'The task has been restored', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  restore(@Param('id') id: string): Promise<Task> {
    return this.tasksService.restore(id);
  }
} 