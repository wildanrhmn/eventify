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
import { EventsService } from '../services/events.service';
import { UsersService } from '../services/users.service';
import { GuestsService } from '../services/guests.service';
import { TasksService } from '../services/tasks.service';
import { BudgetService } from '../services/budget.service';
import { EventType } from '../models/event.model';
import { UserType } from '../models/user.model';
import { GuestType } from '../models/guest.model';
import { TaskType } from '../models/task.model';
import { BudgetType } from '../models/budget.model';
import { CreateEventInput, UpdateEventInput } from '../inputs/event.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../entities/user.entity';
import { Event } from '../entities/event.entity';
import { mapToGraphQLType, mapArrayToGraphQLType } from '../utils/type-mappers';

@Resolver(() => EventType)
export class EventsResolver {
  constructor(
    private eventsService: EventsService,
    private usersService: UsersService,
    private guestsService: GuestsService,
    private tasksService: TasksService,
    private budgetService: BudgetService,
  ) {}

  @Query(() => [EventType])
  @UseGuards(GqlAuthGuard)
  async events(): Promise<EventType[]> {
    const events = await this.eventsService.findAll();
    return mapArrayToGraphQLType<EventType>(events);
  }

  @Query(() => [EventType])
  @UseGuards(GqlAuthGuard)
  async myEvents(@CurrentUser() user: User): Promise<EventType[]> {
    const events = await this.eventsService.findByOrganizer(user.id);
    return mapArrayToGraphQLType<EventType>(events);
  }

  @Query(() => EventType)
  @UseGuards(GqlAuthGuard)
  async event(@Args('id', { type: () => ID }) id: string): Promise<EventType> {
    const event = await this.eventsService.findOne(id);
    return mapToGraphQLType<EventType>(event);
  }

  @Mutation(() => EventType)
  @UseGuards(GqlAuthGuard)
  async createEvent(
    @CurrentUser() user: User,
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Promise<EventType> {
    const event = await this.eventsService.create(user.id, createEventInput);
    return mapToGraphQLType<EventType>(event);
  }

  @Mutation(() => EventType)
  @UseGuards(GqlAuthGuard)
  async updateEvent(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
  ): Promise<EventType> {
    const event = await this.eventsService.update(id, updateEventInput);
    console.log(event);
    return mapToGraphQLType<EventType>(event);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeEvent(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.eventsService.remove(id);
  }

  @ResolveField(() => UserType)
  async organizer(@Parent() event: Event): Promise<UserType> {
    const user = await this.usersService.findOne(event.organizerId);
    return mapToGraphQLType<UserType>(user);
  }

  @ResolveField(() => [GuestType])
  async guests(@Parent() event: Event): Promise<GuestType[]> {
    const guests = await this.guestsService.findByEvent(event.id);
    return mapArrayToGraphQLType<GuestType>(guests);
  }

  @ResolveField(() => [TaskType])
  async tasks(@Parent() event: Event): Promise<TaskType[]> {
    const tasks = await this.tasksService.findByEvent(event.id);
    return mapArrayToGraphQLType<TaskType>(tasks);
  }

  @ResolveField(() => [BudgetType])
  async budgetItems(@Parent() event: Event): Promise<BudgetType[]> {
    const budgetItems = await this.budgetService.findByEvent(event.id);
    return mapArrayToGraphQLType<BudgetType>(budgetItems);
  }

  @ResolveField(() => Number)
  async guestCount(@Parent() event: Event): Promise<number> {
    return this.eventsService.getGuestCount(event.id);
  }

  @ResolveField(() => Number)
  async confirmedGuestCount(@Parent() event: Event): Promise<number> {
    return this.eventsService.getConfirmedGuestCount(event.id);
  }

  @ResolveField(() => Number)
  async completedTasksCount(@Parent() event: Event): Promise<number> {
    return this.eventsService.getCompletedTasksCount(event.id);
  }

  @ResolveField(() => Number)
  async totalTasksCount(@Parent() event: Event): Promise<number> {
    return this.eventsService.getTotalTasksCount(event.id);
  }

  @ResolveField(() => Number)
  async totalBudget(@Parent() event: Event): Promise<number> {
    return this.eventsService.getTotalBudget(event.id);
  }

  @ResolveField(() => Number)
  async totalSpent(@Parent() event: Event): Promise<number> {
    return this.eventsService.getTotalSpent(event.id);
  }
}
