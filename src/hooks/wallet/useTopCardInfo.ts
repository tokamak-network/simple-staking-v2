import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";
import { getOldLayerAddress } from '../../utils/getOldLayerAddress';
import { getEventByLayer2, getOperatorUserHistory } from "@/api";
import { useWindowDimensions } from "../useWindowDimensions";
import { BigNumber } from 'ethers';
import { GET_HISTORY } from '../../graphql/getUserHIstory';


export function useTopCardInfo () {
  const { data } = useQuery(GET_CANDIDATE, {
    pollInterval: 10000
  });
  const { account, library } = useWeb3React();
  const { 
    SeigManager_CONTRACT, 
    DepositManager_CONTRACT, 
    Old_DepositManager_CONTRACT, 
    TON_CONTRACT 
  } = useCallContract();
  const [userTotalStaked, setUserTotalStaked] = useState('0.00')
  const [userPendingWithdrawal, setUserPendingWithdrawal] = useState('0.00')
  // const [userHistory, setUserHistory] = useState([])

  useEffect(() => {
    async function fetch () {
      if (data && history) {
        let staked = BigNumber.from('0')
        let userPending = BigNumber.from('0')
        const candidates = await Promise.all(data.candidates.map(async (obj: any, index: number) => {
          let tempObj = obj
          let stakeOf
          
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
              if (account) {
                stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
                const pendingUnstakedAmount = await DepositManager_CONTRACT.pendingUnstaked(obj.candidateContract, account)
                staked = staked.add(stakeOf)
                userPending = userPending.add(pendingUnstakedAmount)
              }
                
            } catch (e) {
              console.log(e)
            }
          }
          return tempObj
        }))

        setUserTotalStaked(staked.toString())
        setUserPendingWithdrawal(userPending.toString())
      }
    }
    fetch()
  }, [data, account])

  return { userTotalStaked, userPendingWithdrawal }
}