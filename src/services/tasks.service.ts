import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { CreateTaskInput, UpdateTaskInput } from '../inputs/task.input';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['event', 'assignedTo'],
    });
  }

  async findByEvent(eventId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { eventId },
      relations: ['event', 'assignedTo'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['event', 'assignedTo'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(createTaskInput: CreateTaskInput): Promise<Task> {
    const event = await this.eventsRepository.findOne({
      where: { id: createTaskInput.eventId },
    });

    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createTaskInput.eventId} not found`,
      );
    }

    let assignedTo = null;
    if (createTaskInput.assignedToId) {
      assignedTo = await this.usersRepository.findOne({
        where: { id: createTaskInput.assignedToId },
      });

      if (!assignedTo) {
        throw new NotFoundException(
          `User with ID ${createTaskInput.assignedToId} not found`,
        );
      }
    }

    const task = this.tasksRepository.create(createTaskInput);

    return this.tasksRepository.save(task);
  }

  async update(id: string, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskInput.assignedToId) {
      const assignedTo = await this.usersRepository.findOne({
        where: { id: updateTaskInput.assignedToId },
      });

      if (!assignedTo) {
        throw new NotFoundException(
          `User with ID ${updateTaskInput.assignedToId} not found`,
        );
      }
    }

    Object.assign(task, updateTaskInput);

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return true;
  }
}
