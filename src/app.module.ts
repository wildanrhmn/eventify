import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// Import entity modules
import { UsersModule } from './modules/users.module';
import { EventsModule } from './modules/events.module';
import { GuestsModule } from './modules/guests.module';
import { TasksModule } from './modules/tasks.module';
import { BudgetModule } from './modules/budget.module';
import { CollaboratorsModule } from './modules/collaborators.module';
import { AuthModule } from './auth/auth.module';

// Import entities
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { Guest } from './entities/guest.entity';
import { Task } from './entities/task.entity';
import { Budget } from './entities/budget.entity';
import { EventCollaborator } from './entities/event-collaborator.entity';
import appConfig from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// App module
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'), 
        database: configService.get<string>('database.database'),
        entities: [User, Event, Guest, Task, Budget, EventCollaborator],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        ssl: configService.get<boolean>('database.ssl'),
        extra: {
          ssl: {
            rejectUnauthorized: false
          }
        },
      }),
    }),

    // GraphQL configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ req }),
      introspection: true,
      cache: 'bounded',
    }),

    // Feature modules
    UsersModule,
    EventsModule,
    GuestsModule,
    TasksModule,
    BudgetModule,
    AuthModule,
    CollaboratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
