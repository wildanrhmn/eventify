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
import { TasksService } from '../services/tasks.service';
import { EventsService } from '../services/events.service';
import { UsersService } from '../services/users.service';
import { TaskType } from '../models/task.model';
import { EventType } from '../models/event.model';
import { UserType } from '../models/user.model';
import { CreateTaskInput, UpdateTaskInput } from '../inputs/task.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Task } from '../entities/task.entity';
import { mapToGraphQLType, mapArrayToGraphQLType } from '../utils/type-mappers';

@Resolver(() => TaskType)
export class TasksResolver {
  constructor(
    private tasksService: TasksService,
    private eventsService: EventsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [TaskType])
  @UseGuards(GqlAuthGuard)
  async tasks(): Promise<TaskType[]> {
    const tasks = await this.tasksService.findAll();
    return mapArrayToGraphQLType(tasks);
  }

  @Query(() => [TaskType])
  @UseGuards(GqlAuthGuard)
  async eventTasks(
    @Args('eventId', { type: () => ID }) eventId: string,
  ): Promise<TaskType[]> {
    const tasks = await this.tasksService.findByEvent(eventId);
    return mapArrayToGraphQLType(tasks);
  }

  @Query(() => TaskType)
  @UseGuards(GqlAuthGuard)
  async task(@Args('id', { type: () => ID }) id: string): Promise<TaskType> {
    const task = await this.tasksService.findOne(id);
    return mapToGraphQLType(task);
  }

  @Mutation(() => TaskType)
  @UseGuards(GqlAuthGuard)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<TaskType> {
    const task = await this.tasksService.create(createTaskInput);
    return mapToGraphQLType(task);
  }

  @Mutation(() => TaskType)
  @UseGuards(GqlAuthGuard)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<TaskType> {
    const task = await this.tasksService.update(id, updateTaskInput);
    return mapToGraphQLType(task);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeTask(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.tasksService.remove(id);
  }

  @ResolveField(() => EventType)
  async event(@Parent() task: Task): Promise<EventType> {
    const event = await this.eventsService.findOne(task.eventId);
    return mapToGraphQLType(event);
  }

  @ResolveField(() => UserType, { nullable: true })
  async assignedTo(@Parent() task: Task): Promise<UserType | null> {
    if (!task.assignedToId) return null;
    const user = await this.usersService.findOne(task.assignedToId);
    return mapToGraphQLType(user);
  }
}
