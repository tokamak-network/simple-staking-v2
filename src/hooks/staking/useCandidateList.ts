import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";

export function useCandidateList () {
  const [candidateList, setCandidateList] = useState<any[]>([]);
  const { data } = useQuery(GET_CANDIDATE, {
    pollInterval: 10000
  });
  const { account } = useWeb3React();
  const { SeigManager_CONTRACT } = useCallContract();

  useEffect(() => {
    
    async function fetch () {
      
      if (data) {
        const candidates = await Promise.all(data.candidates.map(async (obj: any) => {
          let tempObj = obj
          if (account && SeigManager_CONTRACT) {
            const stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
            tempObj = {
              ...obj,
              stakeOf: stakeOf.toString(),
            }
          }
          return tempObj
        }))
        setCandidateList(candidates)
      }
    }
    fetch()
  }, [data])

  return { candidateList }
}