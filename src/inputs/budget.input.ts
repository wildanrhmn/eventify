import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { BudgetItemType, BudgetItemStatus } from '../entities/budget.entity';

@InputType()
export class CreateBudgetItemInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => BudgetItemType, { nullable: true })
  @IsOptional()
  type?: BudgetItemType;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  estimatedCost: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualCost?: number;

  @Field(() => BudgetItemStatus, { nullable: true })
  @IsOptional()
  status?: BudgetItemStatus;

  @Field({ nullable: true })
  @IsOptional()
  vendorName?: string;

  @Field({ nullable: true })
  @IsOptional()
  vendorContact?: string;

  @Field()
  @IsUUID()
  eventId: string;
}

@InputType()
export class UpdateBudgetItemInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => BudgetItemType, { nullable: true })
  @IsOptional()
  type?: BudgetItemType;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedCost?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualCost?: number;

  @Field(() => BudgetItemStatus, { nullable: true })
  @IsOptional()
  status?: BudgetItemStatus;

  @Field({ nullable: true })
  @IsOptional()
  vendorName?: string;

  @Field({ nullable: true })
  @IsOptional()
  vendorContact?: string;
}
