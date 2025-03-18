import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from '../services/events.service';
import { EventsResolver } from '../resolvers/events.resolver';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { Guest } from '../entities/guest.entity';
import { Task } from '../entities/task.entity';
import { Budget } from '../entities/budget.entity';
import { EventCollaborator } from '../entities/event-collaborator.entity';
import { UsersModule } from './users.module';
import { GuestsModule } from './guests.module';
import { TasksModule } from './tasks.module';
import { BudgetModule } from './budget.module';
import { CollaboratorsModule } from './collaborators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User, Guest, Task, Budget, EventCollaborator]),
    forwardRef(() => UsersModule),
    forwardRef(() => GuestsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => BudgetModule),
    forwardRef(() => CollaboratorsModule),
  ],
  providers: [EventsService, EventsResolver],
  exports: [EventsService],
})
export class EventsModule {}
