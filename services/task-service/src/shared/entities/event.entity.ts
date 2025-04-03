import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EventType } from '../interfaces/events.interface';

@Entity('events')
export class Event {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType
  })
  type: EventType;

  @Column('jsonb')
  data: any;

  @CreateDateColumn()
  timestamp: Date;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  version?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 