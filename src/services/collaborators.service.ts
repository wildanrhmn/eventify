import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCollaborator } from 'src/entities/event-collaborator.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';
import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CollaboratorRole } from 'src/entities/event-collaborator.entity';
import {
  AddCollaboratorInput,
  UpdateCollaboratorInput,
} from 'src/inputs/collaborator.input';

@Injectable()
export class CollaboratorsService {
  constructor(
    @InjectRepository(EventCollaborator)
    private collaboratorsRepository: Repository<EventCollaborator>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEvent(eventId: string): Promise<EventCollaborator[]> {
    return this.collaboratorsRepository.find({
      where: { eventId },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<EventCollaborator[]> {
    return this.collaboratorsRepository.find({
      where: { userId, accepted: true },
      relations: ['event'],
    });
  }

  async findPendingInvitations(userId: string): Promise<EventCollaborator[]> {
    return this.collaboratorsRepository.find({
      where: { userId, accepted: false },
      relations: ['event'],
    });
  }

  async addCollaborator(
    organizerId: string,
    input: AddCollaboratorInput,
  ): Promise<EventCollaborator> {
    const event = await this.eventsRepository.findOne({
      where: { id: input.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new UnauthorizedException(
        'Only the event organizer can add collaborators',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new NotFoundException(`No user found with email: ${input.email}`);
    }

    const existing = await this.collaboratorsRepository.findOne({
      where: { eventId: input.eventId, userId: user.id },
    });

    if (existing) {
      throw new ConflictException(
        'This user is already a collaborator for this event',
      );
    }

    const collaborator = this.collaboratorsRepository.create({
      eventId: input.eventId,
      userId: user.id,
      role: input.role,
      accepted: false,
    });

    return this.collaboratorsRepository.save(collaborator);
  }

  async updateCollaborator(
    id: string,
    input: UpdateCollaboratorInput,
  ): Promise<EventCollaborator> {
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    Object.assign(collaborator, input);

    return this.collaboratorsRepository.save(collaborator);
  }

  async removeCollaborator(id: string, userId: string): Promise<boolean> {
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    if (
      collaborator.event.organizerId !== userId &&
      collaborator.userId !== userId
    ) {
      throw new UnauthorizedException(
        'You do not have permission to remove this collaborator',
      );
    }

    const result = await this.collaboratorsRepository.delete(id);
    return result.affected > 0;
  }

  async hasAccessToEvent(userId: string, eventId: string): Promise<boolean> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) return false;

    if (event.organizerId === userId) return true;

    const collaborator = await this.collaboratorsRepository.findOne({
      where: {
        eventId,
        userId,
        accepted: true,
      },
    });

    return !!collaborator;
  }

  async getCollaboratorRole(
    userId: string,
    eventId: string,
  ): Promise<CollaboratorRole | null> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) return null;
    
    if (event.organizerId === userId) return CollaboratorRole.ADMIN;

    const collaborator = await this.collaboratorsRepository.findOne({
      where: {
        eventId,
        userId,
        accepted: true,
      },
    });

    return collaborator ? collaborator.role : null;
  }

  async findOne(id: string): Promise<EventCollaborator> {
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }
}
