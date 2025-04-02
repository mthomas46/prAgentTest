import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  Patch,
  HttpStatus,
  BadRequestException,
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
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data or duplicate ID' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.tasksService.create(createTaskDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The task has been updated', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.tasksService.update(id, createTaskDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The task has been deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.tasksService.remove(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Restore a soft-deleted task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The task has been restored' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.tasksService.restore(id);
  }
}
