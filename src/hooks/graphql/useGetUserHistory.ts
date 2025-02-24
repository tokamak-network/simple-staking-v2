import { GET_HISTORY } from "@/graphql/query/getUserHIstory";
import { useQuery } from "@apollo/client";
import ms from "ms";
import { useMemo } from "react";

export function useGetUserHistory (account: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_HISTORY, {
    variables: {
      id: account?.toLowerCase()
    },
    pollInterval: ms(`10s`),
  });

  return useMemo(
    () => ({
      error,
      loading,
      users: data?.users
    }), [data, error, loading]
  )
}