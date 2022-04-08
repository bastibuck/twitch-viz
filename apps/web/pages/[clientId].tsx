import { useRouter } from "next/router";
import React from "react";
import { VictoryLabel, VictoryPie } from "victory";

import { usePingClient } from "../graphql/hooks/channel";
import { useVizData } from "../graphql/hooks/useVizData";

const ChannelVizPage = () => {
  const router = useRouter();
  const { clientId } = router.query;

  if (Array.isArray(clientId)) {
    throw new Error("Falsy client ID");
  }

  const { data: isClientActive, isLoading, isError } = usePingClient(clientId);

  const {
    totalMessages,
    modMessages,
    subMessages,
    userMessages,
    emojiOnlyMessages,
    withEmojiMessages,
    withoutEmojiMessages,
    ...vizData
  } = useVizData(clientId);

  if (isLoading) {
    return "Loading";
  }

  if (isError) {
    return "Error";
  }

  return (
    <>
      <h1>Twitch Viz</h1>

      <table role="grid">
        <tbody>
          {Object.entries(vizData).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid">
        <svg viewBox="0 0 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={[
              { x: 1, y: modMessages, label: "Mods" },
              { x: 2, y: subMessages, label: "Subs" },
              { x: 3, y: userMessages, label: "Users" },
            ]}
            colorScale={["#AAA1C8", "#967AA1", "#D5C6E0"]}
            innerRadius={85}
            labelRadius={({ innerRadius }) => (innerRadius as number) + 17}
            labelPlacement="parallel"
            style={{
              labels: { fill: "white", fontWeight: "bold" },
            }}
            padAngle={1}
          />
          <VictoryLabel
            textAnchor="middle"
            style={[
              { fill: "inherit", fontSize: 20 },
              { fill: "inherit", fontSize: 40 },
            ]}
            lineHeight={1.1}
            x={200}
            y={180}
            text={["Total messages:", totalMessages.toString()]}
          />
        </svg>

        <svg viewBox="0 0 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={[
              { x: 1, y: emojiOnlyMessages, label: "Only" },
              { x: 2, y: withEmojiMessages, label: "With" },
              { x: 3, y: userMessages, label: "No" },
            ]}
            colorScale={["#AAA1C8", "#967AA1", "#D5C6E0"]}
            innerRadius={85}
            labelRadius={({ innerRadius }) => (innerRadius as number) + 17}
            labelPlacement="parallel"
            style={{
              labels: { fill: "white", fontWeight: "bold" },
            }}
            padAngle={1}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 20, fill: "inherit" }}
            x={200}
            y={200}
            text={"Emojis"}
          />
        </svg>
      </div>

      {isClientActive === false ? (
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            textAlign: "center",
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "white", padding: "50px 100px" }}>
            <h1>Session ended</h1>
            <button onClick={() => router.push("/")}>Zurück</button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ChannelVizPage;
