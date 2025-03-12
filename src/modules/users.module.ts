import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../services/users.service';
import { UsersResolver } from '../resolvers/users.resolver';
import { User } from '../entities/user.entity';
import { EventsModule } from './events.module';
import { TasksModule } from './tasks.module';
import { GuestsModule } from './guests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // Use forwardRef to avoid circular dependency issues
    // These will be needed for the resolver's ResolveField methods
    EventsModule,
    TasksModule,
    GuestsModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
