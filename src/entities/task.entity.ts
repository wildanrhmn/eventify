import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  TO_DO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  BLOCKED = 'blocked'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TO_DO
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority: TaskPriority;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @ManyToOne(() => Event, event => event.tasks)
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => User, user => user.assignedTasks, { nullable: true })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}