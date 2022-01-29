import { Injectable } from "@nestjs/common";

import { NewClientInput } from "./client.input";
import { Client } from "./client.model";

@Injectable()
export class ClientService {
  async isClientActive(clientId: string): Promise<boolean> {
    console.log("checking if clientID is actively monitored... " + clientId);

    return Math.random() > 0.5;
  }

  async create(data: NewClientInput): Promise<Client> {
    const client = new Client(data);

    return client;
  }
}
