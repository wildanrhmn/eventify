import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { EventType } from './event.model';
import { BudgetItemType, BudgetItemStatus } from '../entities/budget.entity';

// Register enums with GraphQL
registerEnumType(BudgetItemType, {
  name: 'BudgetItemType',
  description: 'The type of budget item',
});

registerEnumType(BudgetItemStatus, {
  name: 'BudgetItemStatus',
  description: 'The status of a budget item',
});

@ObjectType('BudgetItem')
export class BudgetType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => BudgetItemType)
  type: BudgetItemType;

  @Field(() => Float)
  estimatedCost: number;

  @Field(() => Float, { nullable: true })
  actualCost: number;

  @Field(() => BudgetItemStatus)
  status: BudgetItemStatus;

  @Field({ nullable: true })
  vendorName: string;

  @Field({ nullable: true })
  vendorContact: string;

  @Field(() => EventType)
  event: EventType;

  @Field()
  eventId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}