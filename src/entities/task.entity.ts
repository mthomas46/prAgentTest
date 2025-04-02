import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
  @ApiProperty({ example: 1, description: 'The unique identifier of the task' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Buy groceries', description: 'The title of the task' })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({ example: 'Buy milk and bread', description: 'The description of the task' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: false, description: 'Whether the task is completed' })
  @Column({ default: false })
  isCompleted: boolean;

  @ApiProperty({ example: '2024-04-02T10:00:00Z', description: 'The due date of the task' })
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @ApiProperty({ example: 'high', description: 'The priority of the task' })
  @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @ApiProperty({ example: '2024-04-02T10:00:00Z', description: 'The creation date of the task' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2024-04-02T10:00:00Z', description: 'The last update date of the task' })
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
} 