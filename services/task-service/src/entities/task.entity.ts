import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../../shared/interfaces/task.interface';

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
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
  })
  @Column({ default: 'pending' })
  status: TaskStatus;

  @ApiProperty({
    description: 'The UUID of the user assigned to this task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @ApiProperty({
    description: 'The due date for the task',
    example: '2025-12-31T23:59:59Z',
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @ApiProperty({
    description: 'Additional metadata for the task',
    example: {
      priority: 'high',
      estimatedHours: 8,
      tags: ['backend', 'security']
    },
    nullable: true,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'The timestamp when the task was created',
    example: '2025-04-03T09:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the task was last updated',
    example: '2025-04-03T09:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'The timestamp when the task was deleted (null if not deleted)',
    example: '2025-04-03T10:00:00Z',
    nullable: true,
  })
  @DeleteDateColumn()
  deletedAt: Date;
} 