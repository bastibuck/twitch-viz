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

    this.totalMessages = 0;
    this.modMessages = 0;
    this.subMessages = 0;
    this.userMessages = 0;

    this.withoutEmojiMessages = 0;
    this.withEmojiMessages = 0;
    this.emojiOnlyMessages = 0;

    this.firstTimers = 0;

    this.replyMessages = 0;

    this.activeChatUsers = new Set();

    this.totalMessagesLength = 0;
  }

  @Field()
  readonly id: string;

  readonly channelName: string;

  readonly createdAt: Date;

  lastPing: Date;

  // viz data
  totalMessages: number;
  modMessages: number;
  subMessages: number;
  userMessages: number;

  withoutEmojiMessages: number;
  withEmojiMessages: number;
  emojiOnlyMessages: number;

  firstTimers: number; // number of users who commented the first time in this channel in this session

  replyMessages: number;

  activeChatUsers: Set<string>;

  totalMessagesLength: number;
}
