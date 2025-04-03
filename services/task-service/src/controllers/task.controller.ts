import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.', type: Task })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.', type: [Task] })
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task.', type: Task })
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.', type: Task })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.taskService.remove(id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiResponse({ status: 200, description: 'The task has been marked as completed.', type: Task })
  async completeTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.completeTask(id);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiResponse({ status: 200, description: 'The task has been assigned.', type: Task })
  async assignTask(@Param('id') id: string, @Query('userId') userId: string): Promise<Task> {
    return this.taskService.assignTask(id, userId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get tasks by status' })
  @ApiResponse({ status: 200, description: 'Return tasks with the specified status.', type: [Task] })
  async getTasksByStatus(@Param('status') status: string): Promise<Task[]> {
    return this.taskService.getTasksByStatus(status);
  }

  @Get('assignee/:userId')
  @ApiOperation({ summary: 'Get tasks assigned to a user' })
  @ApiResponse({ status: 200, description: 'Return tasks assigned to the specified user.', type: [Task] })
  async getTasksByAssignee(@Param('userId') userId: string): Promise<Task[]> {
    return this.taskService.getTasksByAssignee(userId);
  }
} 