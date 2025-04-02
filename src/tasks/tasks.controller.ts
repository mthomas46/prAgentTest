import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted tasks',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all tasks', type: [Task] })
  findAll(@Query('includeDeleted') includeDeleted = false): Promise<Task[]> {
    return this.tasksService.findAll(includeDeleted);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted tasks',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return a task by id', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  findOne(@Param('id') id: string, @Query('includeDeleted') includeDeleted = false): Promise<Task> {
    return this.tasksService.findOne(id, includeDeleted);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The task has been created', type: Task })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The task has been updated', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.update(id, createTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The task has been deleted', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.remove(id);
    return task;
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The task has been restored', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async restore(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.restore(id);
    return task;
  }
}
