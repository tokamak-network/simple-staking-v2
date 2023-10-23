import { GET_MY_STAKED } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";

export function useUserStaked (id: string) {
  const { data } = useQuery(GET_MY_STAKED, {
    variables: {
      id: id
    },
    pollInterval: 10000,
  });

  return data
}