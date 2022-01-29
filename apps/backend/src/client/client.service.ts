import { Injectable } from "@nestjs/common";

import { NewClientInput } from "./client.input";
import { Client } from "./client.model";

@Injectable()
export class ClientService {
  private activeClients: { id: string; lastPing: number }[] = [];

  async isClientActive(clientId: string): Promise<boolean> {
    return this.activeClients.some((client) => client.id === clientId);
  }

  async create(data: NewClientInput): Promise<Client> {
    const client = new Client(data);

    this.activeClients.push({
      id: client.id,
      lastPing: client.lastPing.valueOf(),
    });

    return client;
  }
}
