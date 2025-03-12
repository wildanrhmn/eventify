import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EventType } from './event.model';
import { TaskType } from './task.model';
import { GuestType } from './guest.model';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field(() => [EventType], { nullable: true })
  events: EventType[];

  @Field(() => [TaskType], { nullable: true })
  assignedTasks: TaskType[];

  @Field(() => [GuestType], { nullable: true })
  guestProfiles: GuestType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}