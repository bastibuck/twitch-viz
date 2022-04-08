import { useRouter } from "next/router";
import React from "react";
import { usePingClient } from "../graphql/hooks/channel";
import { useVizData } from "../graphql/hooks/useVizData";

const ChannelVizPage = () => {
  const router = useRouter();
  const { clientId } = router.query;

  if (Array.isArray(clientId)) {
    throw new Error("Falsy client ID");
  }

  const { data: isClientActive, isLoading, isError } = usePingClient(clientId);

  const vizData = useVizData(clientId);

  if (isLoading) {
    return "Loading";
  }

  if (isError) {
    return "Error";
  }

  return (
    <>
      <h1>DATA VIZ</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 10,
          maxWidth: 550,
        }}
      >
        {Object.entries(vizData).map(([key, value]) => (
          <React.Fragment key={key}>
            <div>{key}</div>
            <div>{value}</div>
          </React.Fragment>
        ))}
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
