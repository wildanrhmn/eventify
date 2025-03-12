import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserType } from './user.model';
import { GuestType } from './guest.model';
import { TaskType } from './task.model';
import { BudgetType } from './budget.model';
import { EventStatus } from '../entities/event.entity';

// Register enum with GraphQL
registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: 'The status of the event',
});

@ObjectType('Event')
export class EventType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field({ nullable: true })
  location: string;

  @Field(() => EventStatus)
  status: EventStatus;

  @Field({ nullable: true })
  coverImageUrl: string;

  @Field(() => UserType)
  organizer: UserType;

  @Field()
  organizerId: string;

  @Field(() => [GuestType], { nullable: true })
  guests: GuestType[];

  @Field(() => [TaskType], { nullable: true })
  tasks: TaskType[];

  @Field(() => [BudgetType], { nullable: true })
  budgetItems: BudgetType[];

  // Helper fields for statistics
  @Field(() => Number, { nullable: true })
  guestCount: number;

  @Field(() => Number, { nullable: true })
  confirmedGuestCount: number;

  @Field(() => Number, { nullable: true })
  completedTasksCount: number;

  @Field(() => Number, { nullable: true })
  totalTasksCount: number;

  @Field(() => Number, { nullable: true })
  totalBudget: number;

  @Field(() => Number, { nullable: true })
  totalSpent: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
