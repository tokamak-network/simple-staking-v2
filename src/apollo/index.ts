import { GRAPHQL_API } from "@/constants";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: GRAPHQL_API,
  cache: new InMemoryCache(),
});
