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
import { UsersService } from '../services/users.service';
import { TasksService } from '../services/tasks.service';
import { GuestsService } from '../services/guests.service';
import { EventsService } from 'src/services/events.service';
import { UserType } from '../models/user.model';
import { EventType } from '../models/event.model';
import { TaskType } from '../models/task.model';
import { GuestType } from '../models/guest.model';
import { CreateUserInput, UpdateUserInput } from '../inputs/user.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../entities/user.entity';
import { mapToGraphQLType, mapArrayToGraphQLType } from '../utils/type-mappers';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private eventsService: EventsService,
    private tasksService: TasksService,
    private guestsService: GuestsService,
  ) {}

  @Query(() => [UserType])
  @UseGuards(GqlAuthGuard)
  async users(): Promise<UserType[]> {
    const users = await this.usersService.findAll();
    return mapArrayToGraphQLType<UserType>(users);
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async user(@Args('id', { type: () => ID }) id: string): Promise<UserType> {
    const user = await this.usersService.findOne(id);
    return mapToGraphQLType<UserType>(user);
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<UserType> {
    const foundUser = await this.usersService.findOne(user.id);
    return mapToGraphQLType<UserType>(foundUser);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserType> {
    const user = await this.usersService.create(createUserInput);
    return mapToGraphQLType<UserType>(user);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<UserType> {
    const updatedUser = await this.usersService.update(
      user.id,
      updateUserInput,
    );
    return mapToGraphQLType<UserType>(updatedUser);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeUser(@CurrentUser() user: User): Promise<boolean> {
    return this.usersService.remove(user.id);
  }

  @ResolveField(() => [EventType])
  async events(@Parent() user: User): Promise<EventType[]> {
    const events = await this.eventsService.findByOrganizer(user.id);
    return mapArrayToGraphQLType<EventType>(events);
  }

  @ResolveField(() => [TaskType])
  async assignedTasks(@Parent() user: User): Promise<TaskType[]> {
    const tasks = await this.tasksService.findAll();
    const userTasks = tasks.filter((task) => task.assignedToId === user.id);
    return mapArrayToGraphQLType<TaskType>(userTasks);
  }

  @ResolveField(() => [GuestType])
  async guestProfiles(@Parent() user: User): Promise<GuestType[]> {
    const guests = await this.guestsService.findAll();
    const userGuests = guests.filter((guest) => guest.userId === user.id);
    return mapArrayToGraphQLType<GuestType>(userGuests);
  }
}
