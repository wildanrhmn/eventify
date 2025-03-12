import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// Import entity modules
import { UsersModule } from './modules/users.module';
import { EventsModule } from './modules/events.module';
import { GuestsModule } from './modules/guests.module';
import { TasksModule } from './modules/tasks.module';
import { BudgetModule } from './modules/budget.module';
import { AuthModule } from './auth/auth.module';

// Import entities
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { Guest } from './entities/guest.entity';
import { Task } from './entities/task.entity';
import { Budget } from './entities/budget.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'event_planner'),
        entities: [User, Event, Guest, Task, Budget],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
    }),

    // GraphQL configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req }) => ({ req }),
    }),

    // Feature modules
    UsersModule,
    EventsModule,
    GuestsModule,
    TasksModule,
    BudgetModule,
    AuthModule,
  ],
})
export class AppModule {}
