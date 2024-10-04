import { GET_WITHDRAWAL_AND_DEPOSITED } from "@/graphql/query/getWithdrawalAndDeposited";
import { useQuery } from "@apollo/client";
import ms from "ms";
import { useMemo } from "react";

export function useGetWithdrawalAndDeposited () {
  const { data, loading, error } = useQuery(GET_WITHDRAWAL_AND_DEPOSITED, {
    pollInterval: ms(`15s`),
  });

  return useMemo(
    () => ({
      error,
      loading,
      withdrawalAndDepositeds: data?.withdrawalAndDepositeds
    }), [data, error, loading]
  )
}