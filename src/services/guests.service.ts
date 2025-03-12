import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { CreateGuestInput, UpdateGuestInput } from '../inputs/guest.input';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Guest[]> {
    return this.guestsRepository.find({
      relations: ['event', 'user'],
    });
  }

  async findByEvent(eventId: string): Promise<Guest[]> {
    return this.guestsRepository.find({
      where: { eventId },
      relations: ['event', 'user'],
    });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });

    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    return guest;
  }

  async create(createGuestInput: CreateGuestInput): Promise<Guest> {
    const event = await this.eventsRepository.findOne({
      where: { id: createGuestInput.eventId },
    });

    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createGuestInput.eventId} not found`,
      );
    }

    let user = null;
    if (createGuestInput.userId) {
      user = await this.usersRepository.findOne({
        where: { id: createGuestInput.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${createGuestInput.userId} not found`,
        );
      }
    }

    const { additionalInfo, ...restInput } = createGuestInput;
    const guest = this.guestsRepository.create({
      ...restInput,
      additionalInfo: additionalInfo ? JSON.parse(additionalInfo) : null,
    });

    return this.guestsRepository.save(guest);
  }

  async update(id: string, updateGuestInput: UpdateGuestInput): Promise<Guest> {
    const guest = await this.findOne(id);

    Object.assign(guest, updateGuestInput);

    return this.guestsRepository.save(guest);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.guestsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    return true;
  }
}
