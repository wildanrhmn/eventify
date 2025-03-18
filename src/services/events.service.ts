import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { Guest } from '../entities/guest.entity';
import { Task } from '../entities/task.entity';
import { Budget } from '../entities/budget.entity';
import { RsvpStatus } from '../entities/guest.entity';
import { TaskStatus } from '../entities/task.entity';
import { EventCollaborator } from '../entities/event-collaborator.entity';
import { CreateEventInput, UpdateEventInput } from '../inputs/event.input';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(EventCollaborator)
    private collaboratorsRepository: Repository<EventCollaborator>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['organizer', 'guests', 'tasks', 'budgetItems', 'collaborators'],
    });
  }

  async findByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { organizerId },
      relations: ['organizer', 'guests', 'tasks', 'budgetItems', 'collaborators'],
    });
  }

  async findOne(id: string, userId?: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'guests', 'tasks', 'budgetItems', 'collaborators'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const hasAccess = await this.canUserAccessEvent(userId, id);

    if (!hasAccess) {
      throw new UnauthorizedException('You do not have access to this event');
    }

    return event;
  }

  async create(
    organizerId: string,
    createEventInput: CreateEventInput,
  ): Promise<Event> {
    const organizer = await this.usersRepository.findOne({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new NotFoundException(`User with ID ${organizerId} not found`);
    }

    const event = this.eventsRepository.create({
      ...createEventInput,
      organizerId,
    });

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventInput: UpdateEventInput): Promise<Event> {
    const event = await this.findOne(id);

    Object.assign(event, updateEventInput);

    await this.eventsRepository.save(event);

    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.eventsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return true;
  }

  // Methods to calculate statistics
  async getGuestCount(eventId: string): Promise<number> {
    const count = await this.guestsRepository.count({ where: { eventId } });
    return count;
  }

  async getConfirmedGuestCount(eventId: string): Promise<number> {
    const count = await this.guestsRepository.count({
      where: { eventId, rsvpStatus: RsvpStatus.CONFIRMED },
    });
    return count;
  }

  async getCompletedTasksCount(eventId: string): Promise<number> {
    const count = await this.tasksRepository.count({
      where: { eventId, status: TaskStatus.DONE },
    });
    return count;
  }

  async getTotalTasksCount(eventId: string): Promise<number> {
    const count = await this.tasksRepository.count({ where: { eventId } });
    return count;
  }

  async getTotalBudget(eventId: string): Promise<number> {
    const result = await this.budgetRepository
      .createQueryBuilder('budget')
      .select('SUM(budget.estimatedCost)', 'total')
      .where('budget.eventId = :eventId', { eventId })
      .getRawOne();

    return result.total || 0;
  }

  async getTotalSpent(eventId: string): Promise<number> {
    const result = await this.budgetRepository
      .createQueryBuilder('budget')
      .select('SUM(budget.actualCost)', 'total')
      .where('budget.eventId = :eventId', { eventId })
      .getRawOne();

    return result.total || 0;
  }

  async canUserAccessEvent(userId: string, eventId: string): Promise<boolean> {
    const event = await this.findOne(eventId);

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
}
