import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";

export function useCandidateList () {
  const { data } = useQuery(GET_CANDIDATE);

  return (data)
}