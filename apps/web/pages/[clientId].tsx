import { useRouter } from "next/router";
import { usePingClient } from "../graphql/hooks/channel";

const ChannelVizPage = () => {
  const router = useRouter();
  const { clientId } = router.query;

  if (Array.isArray(clientId)) {
    throw new Error("Falsy client ID");
  }

  const { data, isLoading, isError } = usePingClient(clientId);

  if (isLoading) {
    return "Loading";
  }

  if (isError) {
    return "Error";
  }

  return (
    <>
      <h1>DATA VIZ</h1>

      {data === false ? (
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
