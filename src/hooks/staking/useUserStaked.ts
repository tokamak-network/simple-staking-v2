import { GET_MY_STAKED } from "@/graphql/query/getCandidates";
import { useQuery } from "@apollo/client";
import { useCallback } from "react";

export function useUserStaked (account: string | undefined, stakeId: string) {
    let id
    id = account + '-' + stakeId
    
    const { data } = useQuery(GET_MY_STAKED, {
      variables: {
        id: id
      },
      pollInterval: 10000,
    });
    
    const userStakeds = useCallback(async () => {
      if (data) {
        return data?.userStakeds[0]
      } else {
        return []
      }
    }, [data, account])

    return { userStakeds }
    
  
  
}