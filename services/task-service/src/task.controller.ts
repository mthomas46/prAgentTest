import { Controller, Get, Post, Body, Param, Delete, Patch, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { TaskService } from './task.service';
import { ICreateTaskDto, IUpdateTaskDto } from '../../../shared/interfaces/task.interface';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Controller('tasks')
@UseFilters(new HttpExceptionFilter())
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: ICreateTaskDto) {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.taskService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.taskService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateTaskDto: IUpdateTaskDto) {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return await this.taskService.restore(id);
  }
} 