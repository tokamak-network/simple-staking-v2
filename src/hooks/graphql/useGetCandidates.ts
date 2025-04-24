import { GET_CANDIDATE } from "@/graphql/query/getCandidates";
import { useQuery } from "@apollo/client";
import ms from "ms";
import { useMemo } from "react";

export function useGetCandidates () {
  const { data, loading, error } = useQuery(GET_CANDIDATE, {
    pollInterval: ms(`10s`),
    // fetchPolicy: 'cache-and-network',
  });

  return useMemo(
    () => ({
      error,
      loading,
      candidates: data?.candidates
    }), [data, error, loading]
  )
}