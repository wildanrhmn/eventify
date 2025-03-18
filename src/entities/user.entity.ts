import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Task } from './task.entity';
import { Guest } from './guest.entity';
import { EventCollaborator } from './event-collaborator.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks: Task[];

  @OneToMany(() => Guest, (guest) => guest.user)
  guestProfiles: Guest[];

  @OneToMany(() => EventCollaborator, (collaborator) => collaborator.user)
  collaborations: EventCollaborator[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
