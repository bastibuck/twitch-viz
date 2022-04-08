import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";

import { Client } from "./client.model";
import { ClientService } from "./client.service";
import {
  NewClientInput,
  PingClientInput,
  SubscriptionClientInput,
} from "./client.input";

export const pubSub = new PubSub();

@ObjectType()
export class VizData {
  @Field((type) => Int)
  readonly totalMessages: number;

  @Field((type) => Int)
  readonly modMessages: number;

  @Field((type) => Int)
  readonly subMessages: number;

  @Field((type) => Int)
  readonly userMessages: number;

  @Field((type) => Int)
  withouEmojiMessages: number;

  @Field((type) => Int)
  withEmojiMessages: number;

  @Field((type) => Int)
  emoteOnlyMessages: number;

  @Field((type) => Int)
  firstTimers: number; // number of users who commented the first time in this channel in this session

  @Field((type) => Int)
  replyMessages: number;

  @Field((type) => Int)
  activeChatUsers: number;

  @Field((type) => Int)
  averageMessageLength: number;
}

@Resolver((of) => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query((returns) => Boolean)
  async ping(
    @Args("pingClientInput") pingClientInput: PingClientInput,
  ): Promise<boolean> {
    return this.clientService.isClientActive(pingClientInput.clientId);
  }

  @Mutation((returns) => Client)
  async addChat(
    @Args("addChatInput") addChatInput: NewClientInput,
  ): Promise<Client> {
    // TODO! validate input to be valid twitch channel
    const client = await this.clientService.create(addChatInput);

    return client;
  }

  @Subscription((returns) => VizData!, {
    filter: (payload, variables) =>
      payload.clientId === variables.subscriptionClientInput.clientId,
  })
  async vizData(
    @Args("subscriptionClientInput")
    subscriptionClientInput: SubscriptionClientInput,
  ) {
    if (
      !(await this.clientService.isClientActive(
        subscriptionClientInput.clientId,
      ))
    ) {
      throw new Error("Client not active");
    }

    return pubSub.asyncIterator("vizData");
  }
}
