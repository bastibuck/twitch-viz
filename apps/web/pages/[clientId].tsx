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

  // client is not active anymore
  if (data === false) {
    return "Info Modal with Back Btn";
  }

  return <h1>DATA VIZ</h1>;
};

export default ChannelVizPage;
