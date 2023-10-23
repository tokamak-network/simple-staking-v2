import { GET_MY_STAKED } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

export function useUserStaked (id: string) {
  const [userStakeds, setUserStakeds] = useState()
  const { data } = useQuery(GET_MY_STAKED, {
    variables: {
      id: id
    },
    // pollInterval: 10000,
  });
  useEffect(() => {
    setUserStakeds(data?.userStakeds[0])
  }, [data, userStakeds])
  
  return { userStakeds }
}