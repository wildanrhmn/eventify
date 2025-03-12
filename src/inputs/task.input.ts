import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  priority?: TaskPriority;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @Field()
  @IsUUID()
  eventId: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  priority?: TaskPriority;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}