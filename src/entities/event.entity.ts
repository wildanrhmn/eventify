import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Task } from './task.entity';
import { Budget } from './budget.entity';

export enum EventStatus {
  PLANNING = 'planning',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PLANNING
  })
  status: EventStatus;

  @Column({ nullable: true })
  coverImageUrl: string;

  @ManyToOne(() => User, user => user.events)
  organizer: User;

  @Column()
  organizerId: string;

  @OneToMany(() => Guest, guest => guest.event)
  guests: Guest[];

  @OneToMany(() => Task, task => task.event)
  tasks: Task[];

  @OneToMany(() => Budget, budget => budget.event)
  budgetItems: Budget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}