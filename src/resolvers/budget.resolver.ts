import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BudgetService } from '../services/budget.service';
import { EventsService } from '../services/events.service';
import { BudgetType } from '../models/budget.model';
import { EventType } from '../models/event.model';
import {
  CreateBudgetItemInput,
  UpdateBudgetItemInput,
} from '../inputs/budget.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Budget } from '../entities/budget.entity';
import { mapToGraphQLType, mapArrayToGraphQLType } from '../utils/type-mappers';

@Resolver(() => BudgetType)
export class BudgetResolver {
  constructor(
    private budgetService: BudgetService,
    private eventsService: EventsService,
  ) {}

  @Query(() => [BudgetType])
  @UseGuards(GqlAuthGuard)
  async budgetItems(): Promise<BudgetType[]> {
    const budgets = await this.budgetService.findAll();
    return mapArrayToGraphQLType<BudgetType>(budgets);
  }

  @Query(() => [BudgetType])
  @UseGuards(GqlAuthGuard)
  async eventBudgetItems(
    @Args('eventId', { type: () => ID }) eventId: string,
  ): Promise<BudgetType[]> {
    const budgets = await this.budgetService.findByEvent(eventId);
    return mapArrayToGraphQLType<BudgetType>(budgets);
  }

  @Query(() => BudgetType)
  @UseGuards(GqlAuthGuard)
  async budgetItem(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BudgetType> {
    const budget = await this.budgetService.findOne(id);
    return mapToGraphQLType<BudgetType>(budget);
  }

  @Mutation(() => BudgetType)
  @UseGuards(GqlAuthGuard)
  async createBudgetItem(
    @Args('createBudgetItemInput') createBudgetItemInput: CreateBudgetItemInput,
  ): Promise<BudgetType> {
    const budget = await this.budgetService.create(createBudgetItemInput);
    return mapToGraphQLType<BudgetType>(budget);
  }

  @Mutation(() => BudgetType)
  @UseGuards(GqlAuthGuard)
  async updateBudgetItem(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBudgetItemInput') updateBudgetItemInput: UpdateBudgetItemInput,
  ): Promise<BudgetType> {
    const budget = await this.budgetService.update(id, updateBudgetItemInput);
    return mapToGraphQLType<BudgetType>(budget);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeBudgetItem(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.budgetService.remove(id);
  }

  @ResolveField(() => EventType)
  async event(@Parent() budgetItem: Budget): Promise<EventType> {
    const event = await this.eventsService.findOne(budgetItem.eventId);
    return mapToGraphQLType<EventType>(event);
  }
}
