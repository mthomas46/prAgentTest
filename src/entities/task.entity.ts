import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDate,
} from 'class-validator';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('task')
export class Task {
  @ApiProperty({ example: 1, description: 'The unique identifier of the task' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Buy groceries', description: 'The title of the task' })
  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Buy milk and bread', description: 'The description of the task' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: false, description: 'Whether the task is completed' })
  @Column({ default: false })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: 'medium', description: 'The priority of the task', enum: TaskPriority })
  @Column({ type: 'varchar', default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ example: '2024-04-02T10:00:00Z', description: 'The due date of the task' })
  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  @IsDate()
  dueDate: Date;

  @ApiProperty({ example: '2024-04-02T10:00:00Z', description: 'The creation date of the task' })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty({ example: '2024-04-02T10:00:00Z', description: 'The last update date of the task' })
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
