import { Field, ID, ObjectType } from "@nestjs/graphql";
import { EventType } from "./event.model";
import { UserType } from "./user.model";

@ObjectType('Collaborator')
export class CollaboratorType {
  @Field(() => ID)
  id: string;

  @Field(() => EventType)
  event: EventType;

  @Field()
  eventId: string;

  @Field(() => UserType)
  user: UserType;

  @Field()
  userId: string;

  @Field(() => String)
  role: string;

  @Field()
  accepted: boolean;

  @Field()
  createdAt: Date;
}