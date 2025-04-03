import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ITask, TaskStatus } from '../../../shared/interfaces/task.interface';

@Entity('tasks')
export class Task implements ITask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ nullable: true, type: 'timestamp' })
  dueDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 