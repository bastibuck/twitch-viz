import { Injectable } from "@nestjs/common";
import * as tmi from "tmi.js";

import { NewClientInput } from "./client.input";
import { Client } from "./client.model";
import { pubSub, VizData } from "./client.resolver";

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

    TMI.on("message", (_channel, tags, message, _self) => {
      const ignoredUsers = ["streamlabs"];

      if (ignoredUsers.includes(tags.username)) {
        return;
      }

      // message counts
      client.totalMessages = client.totalMessages + 1;

      if (tags.mod) {
        client.modMessages = client.modMessages + 1;
      } else if (tags.subscriber) {
        client.subMessages = client.subMessages + 1;
      } else {
        client.userMessages = client.userMessages + 1;
      }

      // message types
      if (tags["emote-only"]) {
        client.emoteOnlyMessages = client.emoteOnlyMessages + 1;
      } else if (tags.emotes === null) {
        client.withouEmojiMessages = client.withEmojiMessages + 1;
      } else if (Object.keys(tags.emotes).length > 0) {
        client.withEmojiMessages = client.withEmojiMessages + 1;
      }

      // users
      if (tags["first-msg"]) {
        client.firstTimers = client.firstTimers + 1;
      }

      // replies
      if (tags["reply-parent-msg-id"]) {
        client.replyMessages = client.replyMessages + 1;
      }

      // unique users
      client.activeChatUsers.add(tags["user-id"]);

      // average msg length
      client.totalMessagesLength = client.totalMessagesLength + message.length;

      const vizData: VizData = {
        totalMessages: client.totalMessages,
        modMessages: client.modMessages,
        subMessages: client.subMessages,
        userMessages: client.userMessages,

        withouEmojiMessages: client.withouEmojiMessages,
        withEmojiMessages: client.withEmojiMessages,
        emoteOnlyMessages: client.emoteOnlyMessages,

        firstTimers: client.firstTimers,

        replyMessages: client.replyMessages,

        activeChatUsers: client.activeChatUsers.size,

        averageMessageLength: Math.floor(
          client.totalMessagesLength / client.totalMessages,
        ),
      };

      pubSub.publish("vizData", {
        clientId: client.id,
        vizData,
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
