import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { MIDDLEWARE_API } from "constants/index";

const client = new ApolloClient({
  uri: MIDDLEWARE_API || "https://tosv2-server.tokamak.network/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

export default client;
