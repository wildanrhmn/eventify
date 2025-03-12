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
import { GuestsService } from '../services/guests.service';
import { EventsService } from '../services/events.service';
import { UsersService } from '../services/users.service';
import { GuestType } from '../models/guest.model';
import { EventType } from '../models/event.model';
import { UserType } from '../models/user.model';
import { CreateGuestInput, UpdateGuestInput } from '../inputs/guest.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Guest } from '../entities/guest.entity';
import { mapToGraphQLType, mapArrayToGraphQLType } from '../utils/type-mappers';

@Resolver(() => GuestType)
export class GuestsResolver {
  constructor(
    private guestsService: GuestsService,
    private eventsService: EventsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [GuestType])
  @UseGuards(GqlAuthGuard)
  async guests(): Promise<GuestType[]> {
    const guests = await this.guestsService.findAll();
    return mapArrayToGraphQLType<GuestType>(guests);
  }

  @Query(() => [GuestType])
  @UseGuards(GqlAuthGuard)
  async eventGuests(
    @Args('eventId', { type: () => ID }) eventId: string,
  ): Promise<GuestType[]> {
    const guests = await this.guestsService.findByEvent(eventId);
    return mapArrayToGraphQLType<GuestType>(guests);
  }

  @Query(() => GuestType)
  @UseGuards(GqlAuthGuard)
  async guest(@Args('id', { type: () => ID }) id: string): Promise<GuestType> {
    const guest = await this.guestsService.findOne(id);
    return mapToGraphQLType<GuestType>(guest);
  }

  @Mutation(() => GuestType)
  @UseGuards(GqlAuthGuard)
  async createGuest(
    @Args('createGuestInput') createGuestInput: CreateGuestInput,
  ): Promise<GuestType> {
    const guest = await this.guestsService.create(createGuestInput);
    return mapToGraphQLType<GuestType>(guest);
  }

  @Mutation(() => GuestType)
  @UseGuards(GqlAuthGuard)
  async updateGuest(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateGuestInput') updateGuestInput: UpdateGuestInput,
  ): Promise<GuestType> {
    const guest = await this.guestsService.update(id, updateGuestInput);
    return mapToGraphQLType<GuestType>(guest);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeGuest(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.guestsService.remove(id);
  }

  @ResolveField(() => EventType)
  async event(@Parent() guest: Guest): Promise<EventType> {
    const event = await this.eventsService.findOne(guest.eventId);
    return mapToGraphQLType<EventType>(event);
  }

  @ResolveField(() => UserType, { nullable: true })
  async user(@Parent() guest: Guest): Promise<UserType | null> {
    if (!guest.userId) return null;
    const user = await this.usersService.findOne(guest.userId);
    return mapToGraphQLType<UserType>(user);
  }
}
