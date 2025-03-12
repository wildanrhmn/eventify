import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserType } from './user.model';
import { EventType } from './event.model';
import { RsvpStatus } from '../entities/guest.entity';

// Register enum with GraphQL
registerEnumType(RsvpStatus, {
  name: 'RsvpStatus',
  description: 'The RSVP status of a guest',
});

@ObjectType('Guest')
export class GuestType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field(() => RsvpStatus)
  rsvpStatus: RsvpStatus;

  @Field()
  numberOfGuests: number;

  @Field({ nullable: true })
  dietaryRestrictions: string;

  @Field(() => String, { nullable: true })
  additionalInfo: string;

  @Field(() => EventType)
  event: EventType;

  @Field()
  eventId: string;

  @Field(() => UserType, { nullable: true })
  user: UserType;

  @Field({ nullable: true })
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
