import { ClientError, gql } from "graphql-request";
import {
  UseMutationResult,
  useMutation,
  QueryObserverResult,
  useQuery,
} from "react-query";

import useGraphQLClient from "../client";

// TODO! generate these from schema
type pingClientResult = boolean;

export const usePingClient: (
  clientId: string
) => QueryObserverResult<boolean, ClientError> = (clientId) => {
  const graphQLClient = useGraphQLClient();

  return useQuery<pingClientResult, ClientError>(
    ["pingClient", clientId],
    async () => {
      const query = gql`
        query ping($input: PingClientInput!) {
          ping(pingClientInput: $input)
        }
      `;

      const res = await graphQLClient.request(query, { input: { clientId } });

      return res.ping;
    },
    {
      refetchInterval: 1000 * 60,
    }
  );
};

// TODO! generate these from schema
type createChannelMutationResult = { id: string };
type createChannelInput = { channelName: string };

export const useCreateChannel = (): UseMutationResult<
  createChannelMutationResult,
  ClientError,
  createChannelInput
> => {
  const graphQLClient = useGraphQLClient();

  return useMutation<
    createChannelMutationResult,
    ClientError,
    createChannelInput
  >(async (input) => {
    const res = await graphQLClient.request(
      gql`
        mutation addChat($input: NewClientInput!) {
          addChat(addChatInput: $input) {
            id
          }
        }
      `,
      { input }
    );

    return res.addChat;
  });
};
