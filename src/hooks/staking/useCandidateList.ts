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
          let stakeOf
          let sumPending
          let stakeOfCandidate
          let oldCommitHistory
          let oldHistory

          const oldCandidate = getOldLayerAddress(obj.candidateContract)

          if (oldCandidate) {
            oldHistory = await getOperatorUserHistory(oldCandidate)
            oldCommitHistory = await getEventByLayer2(oldCandidate, 'Comitted', 1, 300)
          }
          if (
            SeigManager_CONTRACT && 
            DepositManager_CONTRACT && 
            Old_DepositManager_CONTRACT && 
            obj
          ) {
            try{
              if (account) stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
              
              stakeOfCandidate = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, obj.candidate)
              const pending = await DepositManager_CONTRACT.pendingUnstakedLayer2(obj.candidateContract)
              const old_pending = await Old_DepositManager_CONTRACT.pendingUnstakedLayer2(oldCandidate)
                
              sumPending = pending.add(old_pending) 
            } catch (e) {
              console.log(e)
            }
          }

          tempObj = {
            ...obj,
            stakeOf: stakeOf && stakeOf.toString(),
            pending: sumPending && sumPending.toString(),
            stakeOfCandidate: stakeOfCandidate && stakeOfCandidate.toString(),
            oldHistory: oldHistory,
            oldCommitHistory: oldCommitHistory
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