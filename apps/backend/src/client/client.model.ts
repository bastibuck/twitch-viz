import { Field, ObjectType } from "@nestjs/graphql";
import { v4 as uuidv4 } from "uuid";

import { NewClientInput } from "./client.input";

@ObjectType()
export class Client {
  constructor(data: NewClientInput) {
    const now = new Date();

    this.id = uuidv4();
    this.channelName = data.channelName;
    this.createdAt = now;
    this.lastPing = now;
  }

  @Field()
  readonly id: string;

  readonly channelName: string;

  readonly createdAt: Date;

  lastPing: Date;
}
