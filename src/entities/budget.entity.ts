import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';

export enum BudgetItemType {
  VENUE = 'venue',
  CATERING = 'catering',
  DECORATION = 'decoration',
  ENTERTAINMENT = 'entertainment',
  PHOTOGRAPHY = 'photography',
  TRANSPORTATION = 'transportation',
  ACCOMMODATION = 'accommodation',
  OTHER = 'other',
}

export enum BudgetItemStatus {
  PLANNED = 'planned',
  QUOTED = 'quoted',
  BOOKED = 'booked',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('budget_items')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: BudgetItemType,
    default: BudgetItemType.OTHER,
  })
  type: BudgetItemType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost: number;

  @Column({
    type: 'enum',
    enum: BudgetItemStatus,
    default: BudgetItemStatus.PLANNED,
  })
  status: BudgetItemStatus;

  @Column({ nullable: true })
  vendorName: string;

  @Column({ nullable: true })
  vendorContact: string;

  @ManyToOne(() => Event, (event) => event.budgetItems)
  event: Event;

  @Column()
  eventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
