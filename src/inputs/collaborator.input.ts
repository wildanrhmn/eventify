import { IsOptional, IsUUID } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsEnum, IsBoolean } from "class-validator";
import { CollaboratorRole } from "src/entities/event-collaborator.entity";

@InputType()
export class AddCollaboratorInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsUUID()
  eventId: string;

  @Field(() => String)
  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}

@InputType()
export class UpdateCollaboratorInput {
  @Field(() => String, { nullable: true })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  accepted?: boolean;
}