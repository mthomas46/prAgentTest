import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskService: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new task',
    description: 'Creates a new task with the provided details'
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Task created successfully',
    type: CreateTaskDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.send({ cmd: 'createTask' }, createTaskDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all tasks',
    description: 'Retrieves a list of all tasks in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all tasks',
    type: [CreateTaskDto]
  })
  async findAll() {
    return this.taskService.send({ cmd: 'findAllTasks' }, {});
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a task by id',
    description: 'Retrieves a specific task by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The unique identifier of the task',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the task',
    type: CreateTaskDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found'
  })
  async findOne(@Param('id') id: string) {
    return this.taskService.send({ cmd: 'findOneTask' }, { id });
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a task',
    description: 'Removes a task from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The unique identifier of the task to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found'
  })
  async remove(@Param('id') id: string) {
    return this.taskService.send({ cmd: 'removeTask' }, { id });
  }
} 