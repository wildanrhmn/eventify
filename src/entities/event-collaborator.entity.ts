import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

export enum CollaboratorRole {
  ADMIN = 'admin', // Can do everything the organizer can
  EDITOR = 'editor', // Can edit event details, manage guests and tasks
  VIEWER = 'viewer', // Read-only access
}

@Entity('event_collaborators')
export class EventCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.collaborators)
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => User, (user) => user.collaborations)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
  })
  role: CollaboratorRole;

  @Column({ default: false })
  accepted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
