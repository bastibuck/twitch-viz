import { useState, useEffect } from "react";

const url = "ws://localhost:5000/graphql";

export const useVizData = (clientId) => {
  const [vizData, setVizData] = useState({
    totalMessages: 0,
    subMessages: 0,
    userMessages: 0,
    modMessages: 0,

    withoutEmojiMessages: 0,
    withEmojiMessages: 0,
    emojiOnlyMessages: 0,

    firstTimers: 0,

    replyMessages: 0,

    activeChatUsers: 0,

    averageMessageLength: 0,
  });

  useEffect(() => {
    const ws = new WebSocket(url, "graphql-ws");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "connection_init", payload: {} }));
      ws.send(
        JSON.stringify({
          id: "1",
          type: "start",
          payload: {
            variables: { clientId },
            query: `
                subscription vizData($clientId: String!) {
                    vizData(subscriptionClientInput: 
                        {
                            clientId: $clientId
                        }
                    ) {
                        totalMessages
                        subMessages
                        userMessages
                        modMessages
                        
                        withoutEmojiMessages
                        withEmojiMessages
                        emojiOnlyMessages
                        
                        firstTimers
                        
                        replyMessages
                        
                        activeChatUsers
                        
                        averageMessageLength
                    }
                }`,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type == "data") {
        if (msg.payload.errors !== undefined) {
          console.error("An error occured", msg.payload.errors);
        } else {
          setVizData(msg.payload.data.vizData);
        }
      }
    };

    return () => {
      // Unsubscribe before exit
      ws.send(JSON.stringify({ id: "1", type: "stop" }));
      ws.close();
    };
  }, [clientId]);

  return vizData;
};
