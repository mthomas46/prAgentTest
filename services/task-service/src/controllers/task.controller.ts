import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, TaskStatus } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task with the provided details and returns the created task.'
  })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data provided.'
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves a list of all tasks in the system.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks.',
    type: [Task]
  })
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a task by id',
    description: 'Retrieves the details of a specific task by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'The task details.',
    type: Task
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.'
  })
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a task',
    description: 'Updates the details of a specific task and returns the updated task.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data provided.'
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.'
  })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Removes a specific task from the system.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.'
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.taskService.remove(id);
  }

  @Put(':id/complete')
  @ApiOperation({
    summary: 'Mark a task as completed',
    description: 'Updates the status of a specific task to completed.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to complete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been marked as completed.',
    type: Task
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.'
  })
  async completeTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.completeTask(id);
  }

  @Put(':id/assign')
  @ApiOperation({
    summary: 'Assign a task to a user',
    description: 'Assigns a specific task to a user identified by their UUID.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to assign',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'userId',
    description: 'The UUID of the user to assign the task to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully assigned.',
    type: Task
  })
  @ApiResponse({
    status: 404,
    description: 'Task or user not found.'
  })
  async assignTask(@Param('id') id: string, @Query('userId') userId: string): Promise<Task> {
    return this.taskService.assignTask(id, userId);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Get tasks by status',
    description: 'Retrieves all tasks with a specific status.'
  })
  @ApiParam({
    name: 'status',
    description: 'The status to filter tasks by',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks with the specified status.',
    type: [Task]
  })
  async getTasksByStatus(@Param('status') status: string): Promise<Task[]> {
    return this.taskService.getTasksByStatus(status);
  }

  @Get('assignee/:userId')
  @ApiOperation({
    summary: 'Get tasks assigned to a user',
    description: 'Retrieves all tasks assigned to a specific user.'
  })
  @ApiParam({
    name: 'userId',
    description: 'The UUID of the user to get tasks for',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks assigned to the specified user.',
    type: [Task]
  })
  async getTasksByAssignee(@Param('userId') userId: string): Promise<Task[]> {
    return this.taskService.getTasksByAssignee(userId);
  }
} 