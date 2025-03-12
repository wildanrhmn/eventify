import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { Event } from '../entities/event.entity';
import {
  CreateBudgetItemInput,
  UpdateBudgetItemInput,
} from '../inputs/budget.input';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Budget[]> {
    return this.budgetRepository.find({
      relations: ['event'],
    });
  }

  async findByEvent(eventId: string): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { eventId },
      relations: ['event'],
    });
  }

  async findOne(id: string): Promise<Budget> {
    const budgetItem = await this.budgetRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!budgetItem) {
      throw new NotFoundException(`Budget item with ID ${id} not found`);
    }

    return budgetItem;
  }

  async create(createBudgetItemInput: CreateBudgetItemInput): Promise<Budget> {
    const event = await this.eventsRepository.findOne({
      where: { id: createBudgetItemInput.eventId },
    });

    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createBudgetItemInput.eventId} not found`,
      );
    }

    const budgetItem = this.budgetRepository.create(createBudgetItemInput);

    return this.budgetRepository.save(budgetItem);
  }

  async update(
    id: string,
    updateBudgetItemInput: UpdateBudgetItemInput,
  ): Promise<Budget> {
    const budgetItem = await this.findOne(id);

    Object.assign(budgetItem, updateBudgetItemInput);

    return this.budgetRepository.save(budgetItem);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.budgetRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Budget item with ID ${id} not found`);
    }

    return true;
  }
}
