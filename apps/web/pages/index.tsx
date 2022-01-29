import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { useCreateChannel } from "../graphql/hooks/channel";

type FormData = {
  channelName: string;
};

const IndexPage = () => {
  // TODO! add field validation
  const { register, handleSubmit } = useForm<FormData>();

  const router = useRouter();

  const createChannelMutation = useCreateChannel();

  const onSubmit = handleSubmit(async (data) => {
    const client = await createChannelMutation.mutateAsync(data);
    router.push(`/${client.id}`);
  });

  return (
    <div>
      <h1>Twitch Channel Data Viz</h1>

      <form onSubmit={onSubmit}>
        <label>Channel</label>
        <input {...register("channelName")} />

        <button type="submit">Viz!</button>
      </form>
    </div>
  );
};

export default IndexPage;
