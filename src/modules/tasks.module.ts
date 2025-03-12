import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from '../services/tasks.service';
import { TasksResolver } from '../resolvers/tasks.resolver';
import { Task } from '../entities/task.entity';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { EventsModule } from './events.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Event, User]),
    forwardRef(() => EventsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}
