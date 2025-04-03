import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

@Entity('tasks')
export class Task {
  @ApiProperty({
    description: 'The unique identifier of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement user authentication',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the task',
    example: 'Implement JWT-based authentication with refresh tokens',
    nullable: true,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'The priority level of the task',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    default: TaskPriority.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Whether the task is completed',
    example: false,
    default: false,
  })
  @Column({ default: false })
  completed: boolean;

  @ApiProperty({
    description: 'The UUID of the user assigned to this task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Column({ nullable: true })
  assignedTo?: string;

  @ApiProperty({
    description: 'The due date for the task',
    example: '2025-12-31T23:59:59Z',
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @ApiProperty({
    description: 'Additional metadata for the task',
    example: {
      estimatedHours: 8,
      tags: ['backend', 'security']
    },
    nullable: true,
  })
  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'The creation date of the task',
    example: '2025-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the task',
    example: '2025-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'The deletion date of the task',
    example: '2025-01-01T00:00:00Z',
    nullable: true,
  })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
} 