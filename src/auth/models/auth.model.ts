import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from '../../models/user.model';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;
}
