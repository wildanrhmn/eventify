import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetService } from '../services/budget.service';
import { BudgetResolver } from '../resolvers/budget.resolver';
import { Budget } from '../entities/budget.entity';
import { Event } from '../entities/event.entity';
import { EventsModule } from './events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, Event]),
    forwardRef(() => EventsModule),
  ],
  providers: [BudgetService, BudgetResolver],
  exports: [BudgetService],
})
export class BudgetModule {}
