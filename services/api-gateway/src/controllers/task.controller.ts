import { Controller, Inject, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskService: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.send('createTask', createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Returns all tasks' })
  async getAllTasks() {
    return this.taskService.send('getAllTasks', {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Returns the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTask(@Param('id') id: string) {
    return this.taskService.send('getTask', { id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.send('updateTask', { id, ...updateTaskDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(@Param('id') id: string) {
    return this.taskService.send('deleteTask', { id });
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  @ApiResponse({ status: 200, description: 'Task marked as completed' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async completeTask(@Param('id') id: string) {
    return this.taskService.send('completeTask', { id });
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign task to user' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async assignTask(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.taskService.send('assignTask', { id, userId });
  }
} 