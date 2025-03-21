import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { ID } from "@nestjs/graphql";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CollaboratorType } from "../models/collaborator.model";
import { CollaboratorsService } from "../services/collaborators.service";
import { EventsService } from "../services/events.service";
import { CurrentUser } from "../auth/current-user.decorator";
import { UsersService } from "../services/users.service";
import { User } from "../entities/user.entity";
import { EventCollaborator } from "../entities/event-collaborator.entity";
import { AddCollaboratorInput } from "../inputs/collaborator.input";
import { EventType } from "../models/event.model";
import { UserType } from "../models/user.model";
import { mapToGraphQLType, mapArrayToGraphQLType } from '../utils/type-mappers';

@Resolver(() => CollaboratorType)
export class CollaboratorsResolver {
  constructor(
    private collaboratorsService: CollaboratorsService,
    private eventsService: EventsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [CollaboratorType])
  @UseGuards(GqlAuthGuard)
  async eventCollaborators(
    @Args('eventId', { type: () => ID }) eventId: string,
    @CurrentUser() user: User
  ): Promise<CollaboratorType[]> {
    const hasAccess = await this.collaboratorsService.hasAccessToEvent(user.id, eventId);
    if (!hasAccess) {
      throw new UnauthorizedException('You do not have access to this event');
    }
    
    const collaborators = await this.collaboratorsService.findByEvent(eventId);
    return mapArrayToGraphQLType(collaborators);
  }

  @Query(() => [CollaboratorType])
  @UseGuards(GqlAuthGuard)
  async myCollaborations(@CurrentUser() user: User): Promise<CollaboratorType[]> {
    const collaborators = await this.collaboratorsService.findByUser(user.id);
    return mapArrayToGraphQLType(collaborators);
  }

  @Query(() => [CollaboratorType])
  @UseGuards(GqlAuthGuard)
  async myPendingInvitations(@CurrentUser() user: User): Promise<CollaboratorType[]> {
    const collaborators = await this.collaboratorsService.findPendingInvitations(user.id);
    return mapArrayToGraphQLType(collaborators);
  }

  @Mutation(() => CollaboratorType)
  @UseGuards(GqlAuthGuard)
  async addCollaborator(
    @Args('input') input: AddCollaboratorInput,
    @CurrentUser() user: User
  ): Promise<CollaboratorType> {
    const collaborator = await this.collaboratorsService.addCollaborator(user.id, input);
    return mapToGraphQLType(collaborator);
  }

  @Mutation(() => CollaboratorType)
  @UseGuards(GqlAuthGuard)
  async acceptCollaboration(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<CollaboratorType> {
    const collaborator = await this.collaboratorsService.findOne(id);
    
    if (!collaborator || collaborator.userId !== user.id) {
      throw new UnauthorizedException('You do not have permission to accept this invitation');
    }
    
    const updatedCollaborator = await this.collaboratorsService.updateCollaborator(id, { accepted: true });
    return mapToGraphQLType(updatedCollaborator);
  }

  @Mutation(() => CollaboratorType)
  @UseGuards(GqlAuthGuard)
  async rejectCollaboration(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<CollaboratorType> {
    const collaborator = await this.collaboratorsService.findOne(id);
    
    if (!collaborator || collaborator.userId !== user.id) {
      throw new UnauthorizedException('You do not have permission to reject this invitation');
    }
    
    const updatedCollaborator = await this.collaboratorsService.updateCollaborator(id, { accepted: false });
    return mapToGraphQLType(updatedCollaborator);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeCollaborator(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    const result = await this.collaboratorsService.removeCollaborator(id, user.id);
    return result;
  }

  @ResolveField(() => EventType)
  async event(@Parent() collaborator: EventCollaborator): Promise<EventType> {
    const event = await this.eventsService.findOne(collaborator.eventId);
    return mapToGraphQLType(event);
  }

  @ResolveField(() => UserType)
  async user(@Parent() collaborator: EventCollaborator): Promise<UserType> {
    const user = await this.usersService.findOne(collaborator.userId);
    return mapToGraphQLType(user);
  }
}