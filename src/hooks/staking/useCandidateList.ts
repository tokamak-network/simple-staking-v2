import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";
import { getOldLayerAddress } from '../../utils/getOldLayerAddress';
import { getEventByLayer2, getOperatorUserHistory } from "@/api";

export function useCandidateList () {
  const [candidateList, setCandidateList] = useState<any[]>([]);
  const { data } = useQuery(GET_CANDIDATE, {
    pollInterval: 10000
  });
  const { account } = useWeb3React();
  const { SeigManager_CONTRACT, DepositManager_CONTRACT, Old_DepositManager_CONTRACT } = useCallContract();

  useEffect(() => {
    
    async function fetch () {
      if (data) {
        const candidates = await Promise.all(data.candidates.map(async (obj: any) => {
          let tempObj = obj
          if (
            account && 
            SeigManager_CONTRACT && 
            DepositManager_CONTRACT && 
            Old_DepositManager_CONTRACT && 
            obj
          ) {
            try{
              const oldCandidate = getOldLayerAddress(obj.candidateContract)
              const stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
              const stakeOfCandidate = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, obj.candidate)
              const pending = await DepositManager_CONTRACT.pendingUnstakedLayer2(obj.candidateContract)
              const old_pending = await Old_DepositManager_CONTRACT.pendingUnstakedLayer2(oldCandidate)

              let oldCommitHistory
              let oldHistory
              if (oldCandidate) {
                oldHistory = await getOperatorUserHistory(oldCandidate)
                oldCommitHistory = await getEventByLayer2(oldCandidate, 'Comitted', 1, 300)
              }
              const sumPending = pending.add(old_pending)
              console.log(oldCandidate, oldHistory)
              tempObj = {
                ...obj,
                stakeOf: stakeOf.toString(),
                pending: sumPending.toString(),
                stakeOfCandidate: stakeOfCandidate.toString(),
                oldHistory: oldHistory
              }
            } catch (e) {
              console.log(e)
            }
          }
          return tempObj
        }))
        setCandidateList(candidates)
      }
    }
    fetch()
  }, [data, account])

  return { candidateList }
}