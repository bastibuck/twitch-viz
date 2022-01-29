import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID } from "class-validator";

@InputType()
export class NewClientInput {
  @Field()
  @IsNotEmpty()
  channelName: string;
}

@InputType()
export class PingClientInput {
  @Field()
  @IsUUID(4)
  clientId: string;
}

@InputType()
export class SubscriptionClientInput {
  @Field()
  @IsUUID(4)
  clientId: string;
}
