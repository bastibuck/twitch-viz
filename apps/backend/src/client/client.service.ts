import { Injectable } from "@nestjs/common";
import * as tmi from "tmi.js";

import { NewClientInput } from "./client.input";
import { Client } from "./client.model";
import { pubSub } from "./client.resolver";

const CHECK_ACTIVE_INTERVAL = 1000 * 60 * 2;
const INACTIVE_TIME = 1000 * 60 * 5;

@Injectable()
export class ClientService {
  private activeClients: {
    id: string;
    lastPing: number;
    interval: NodeJS.Timeout;
  }[] = [];

  async isClientActive(clientId: string): Promise<boolean> {
    const activeClient = this.activeClients.find(
      (client) => client.id === clientId,
    );

    if (!activeClient) {
      return false;
    }

    this.activeClients = this.activeClients.map((client) => ({
      ...client,
      lastPing: new Date().valueOf(),
    }));

    return true;
  }

  async create(data: NewClientInput): Promise<Client> {
    const client = new Client(data);

    const TMI = new tmi.Client({
      channels: [data.channelName],
    });

    TMI.connect();

    TMI.on("message", (channel, tags, message, self) => {
      console.log(`${tags["display-name"]}: ${message}`);

      pubSub.publish("messageCount", {
        clientId: client.id,
        messageCount: message.length,
      });
    });

    const interval = setInterval(() => {
      const activeClient = this.activeClients.find(
        (activeClient) => activeClient.id === client.id,
      );

      if (!activeClient) {
        TMI.disconnect();
        clearInterval(interval);
      }

      if (activeClient.lastPing < new Date().valueOf() - INACTIVE_TIME) {
        this.activeClients = this.activeClients.filter(
          (activeClient) => activeClient.id !== client.id,
        );

        TMI.disconnect();
        clearInterval(interval);
      }
    }, CHECK_ACTIVE_INTERVAL);

    this.activeClients.push({
      id: client.id,
      lastPing: client.lastPing.valueOf(),
      interval,
    });

    return client;
  }
}
