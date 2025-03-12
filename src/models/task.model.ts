import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserType } from './user.model';
import { EventType } from './event.model';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

// Register enums with GraphQL
registerEnumType(TaskPriority, {
  name: 'TaskPriority',
  description: 'The priority level of a task',
});

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'The status of a task',
});

@ObjectType('Task')
export class TaskType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field({ nullable: true })
  dueDate: Date;

  @Field(() => EventType)
  event: EventType;

  @Field()
  eventId: string;

  @Field(() => UserType, { nullable: true })
  assignedTo: UserType;

  @Field({ nullable: true })
  assignedToId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}