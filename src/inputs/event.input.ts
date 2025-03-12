import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

@InputType()
export class CreateEventInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;

  @Field({ nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => EventStatus, { nullable: true })
  @IsOptional()
  status?: EventStatus;

  @Field({ nullable: true })
  @IsOptional()
  coverImageUrl?: string;
}

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => EventStatus, { nullable: true })
  @IsOptional()
  status?: EventStatus;

  @Field({ nullable: true })
  @IsOptional()
  coverImageUrl?: string;
}