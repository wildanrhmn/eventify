import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';
import { RsvpStatus } from '../entities/guest.entity';

@InputType()
export class CreateGuestInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Field(() => RsvpStatus, { nullable: true })
  @IsOptional()
  rsvpStatus?: RsvpStatus;

  @Field({ nullable: true, defaultValue: 1 })
  @IsOptional()
  numberOfGuests?: number;

  @Field({ nullable: true })
  @IsOptional()
  dietaryRestrictions?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  additionalInfo?: string;

  @Field()
  @IsUUID()
  eventId: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;
}

@InputType()
export class UpdateGuestInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Field(() => RsvpStatus, { nullable: true })
  @IsOptional()
  rsvpStatus?: RsvpStatus;

  @Field({ nullable: true })
  @IsOptional()
  numberOfGuests?: number;

  @Field({ nullable: true })
  @IsOptional()
  dietaryRestrictions?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  additionalInfo?: string;
}
