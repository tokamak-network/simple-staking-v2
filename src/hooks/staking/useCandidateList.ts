import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";
import { getOldLayerAddress } from '../../utils/getOldLayerAddress';
import { getEventByLayer2, getOperatorUserHistory } from "@/api";
import { useWindowDimensions } from "../useWindowDimensions";
import { useExpectedSeig } from './useCalculateExpectedSeig';
import { getContract } from "@/components/getContract";
import { toBN } from "web3-utils";
import { calculateExpectedSeig } from "tokamak-staking-lib";
import BN from "bn.js";
import CONTRACT_ADDRESS from "services/addresses/contract";
import Coinage from "services/abi/AutoRefactorCoinage.json"

export function useCandidateList () {
  const [candidateList, setCandidateList] = useState<any[]>([]);
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
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

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
          let expSeig

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

                if (mobile && stakeOf !== '0' && TON_CONTRACT) {
                  const blockNumber = library && await library.getBlockNumber();
                  const Tot = getContract(await SeigManager_CONTRACT.tot(), Coinage, library, account)
                  const coinage = getContract(await SeigManager_CONTRACT.coinages(obj.candidateContract), Coinage, library, account)
                  
                  const userStaked = await coinage.balanceOf(account)

                  const tonTotalSupply = await TON_CONTRACT.totalSupply();
                  const totTotalSupply = await Tot.totalSupply()
                  const tonBalanceOfWTON = await TON_CONTRACT.balanceOf(CONTRACT_ADDRESS.WTON_ADDRESS)
                  const relativeSeigRate = await SeigManager_CONTRACT.relativeSeigRate()
                  const tos = toBN(tonTotalSupply)
                      .mul(toBN('1000000000'))
                      .add(toBN(totTotalSupply))
                      .sub(toBN(tonBalanceOfWTON));
                  const fromBlockNumber = await SeigManager_CONTRACT.lastCommitBlock(obj.candidateContract)
                  expSeig = calculateExpectedSeig(
                      new BN(fromBlockNumber.toString()),
                      new BN(blockNumber),
                      new BN(userStaked.toString()),
                      new BN(totTotalSupply.toString()),
                      new BN(tos),
                      new BN(relativeSeigRate.toString())
                  );
                }
              }
              
              stakeOfCandidate = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, obj.candidate)
              const pending = await DepositManager_CONTRACT.pendingUnstakedLayer2(obj.candidateContract)
              if (oldCandidate) {
                const old_pending = await Old_DepositManager_CONTRACT.pendingUnstakedLayer2(oldCandidate)
                sumPending = pending.add(old_pending) 
              } else {
                sumPending = pending
              }
                
            } catch (e) {
              console.log(e)
            }
          }
          
          tempObj = {
            ...obj,
            stakeOf: stakeOf ? stakeOf.toString() : '0.00',
            expSeig: expSeig ? parseFloat(expSeig) / Math.pow(10, 27) : 0,
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