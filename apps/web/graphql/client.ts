import { GraphQLClient } from "graphql-request";

const useGraphQLClient = (): GraphQLClient => {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:5000/graphql";

  return new GraphQLClient(endpoint);
};

export default useGraphQLClient;
