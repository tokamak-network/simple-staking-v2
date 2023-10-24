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
      // if (account && SeigManager_CONTRACT) {
      //   const tokamak = await SeigManager_CONTRACT.stakeOf('0x0F42D1C40b95DF7A1478639918fc358B4aF5298D', '0x8c595DA827F4182bC0E3917BccA8e654DF8223E1')
      //   console.log(tokamak.toString())
      // }
      if (data) {
        const candidates = await Promise.all(data.candidates.map(async (obj: any) => {
          // console.log(obj)
          let tempObj = obj
          if (account && SeigManager_CONTRACT) {
            const stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
            tempObj = {
              ...obj,
              stakeOf: stakeOf.toString()
            }
            // console.log(stakeOf.toString())
            // console.log(tempObj)
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