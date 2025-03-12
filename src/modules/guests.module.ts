import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from '../services/guests.service';
import { GuestsResolver } from '../resolvers/guests.resolver';
import { Guest } from '../entities/guest.entity';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { EventsModule } from './events.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, Event, User]),
    forwardRef(() => EventsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [GuestsService, GuestsResolver],
  exports: [GuestsService],
})
export class GuestsModule {}
