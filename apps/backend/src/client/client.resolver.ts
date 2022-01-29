import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";

import { Client } from "./client.model";
import { ClientService } from "./client.service";
import { NewClientInput, PingClientInput } from "./client.input";

const pubSub = new PubSub();

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
    const client = await this.clientService.create(addChatInput);

    return client;
  }
}
