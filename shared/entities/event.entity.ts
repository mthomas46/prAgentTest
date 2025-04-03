import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { EventType } from '../interfaces/events.interface';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  @Index()
  type: EventType;

  @Column('jsonb')
  data: any;

  @Column()
  source: string;

  @Column({ nullable: true })
  correlationId?: string;

  @Column({ default: false })
  processed: boolean;

  @Column({ nullable: true })
  processedAt?: Date;

  @Column({ nullable: true })
  error?: string;

  @Column({ default: 0 })
  retryCount: number;

  @CreateDateColumn()
  createdAt: Date;
} 