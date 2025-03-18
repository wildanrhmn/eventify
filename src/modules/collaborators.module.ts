import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorsService } from '../services/collaborators.service';
import { CollaboratorsResolver } from '../resolvers/collaborators.resolver';
import { EventCollaborator } from '../entities/event-collaborator.entity';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { EventsModule } from './events.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventCollaborator, Event, User]),
    forwardRef(() => EventsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CollaboratorsService, CollaboratorsResolver],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
