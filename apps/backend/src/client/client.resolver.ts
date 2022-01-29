import {
  Args,
  Int,
  Mutation,
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

  @Subscription((returns) => Int, {
    filter: (payload, variables) =>
      payload.clientId === variables.subscriptionClientInput.clientId,
  })
  messageCount(
    @Args("subscriptionClientInput")
    subscriptionClientInput: SubscriptionClientInput,
  ) {
    return pubSub.asyncIterator("messageCount");
  }
}
