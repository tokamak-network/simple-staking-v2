import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import useCallContract from "../useCallContract";
import { getOldLayerAddress } from "../../utils/getOldLayerAddress";
import { getEventByLayer2, getOperatorUserHistory } from "@/api";
import { useWindowDimensions } from "../useWindowDimensions";
import { getContract } from "@/components/getContract";
import { toBN } from "web3-utils";
import { calculateExpectedSeig } from "tokamak-staking-lib";
import BN from "bn.js";
import CONTRACT_ADDRESS from "services/addresses/contract";
import Coinage from "services/abi/AutoRefactorCoinage.json";
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";
import { useGetCandidates } from "../graphql/useGetCandidates";

export function useCandidateList() {
  const [candidateList, setCandidateList] = useState<any[]>([]);
  const { candidates } = useGetCandidates();
  const { account, library, chainId } = useWeb3React();
  const [txPending] = useRecoilState(txState);
  const {
    SeigManager_CONTRACT,
    DepositManager_CONTRACT,
    Old_DepositManager_CONTRACT,
    TON_CONTRACT,
  } = useCallContract();
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  useEffect(() => {
    async function fetchCandidates() {
      if (!candidates) return;
      console.log(candidates)
      const candidatesList = await Promise.all(
        candidates.map((candidateObj: any, index: number) =>
          fetchCandidateDetails(candidateObj, index)
        )
      );
      setCandidateList(candidatesList);
    }

    async function fetchCandidateDetails(candidateObj: any, index: number) {
      const { candidateContract, stakedUserList, candidate, name } = candidateObj;
      let stakeOf, sumPending, stakeOfCandidate, oldCommitHistory, oldHistory, expSeig, myPending;

      const oldCandidate = getOldLayerAddress(candidateContract);
      if (oldCandidate) {
        try {
          [oldHistory, oldCommitHistory] = await Promise.all([
            getOperatorUserHistory(oldCandidate),
            getEventByLayer2(oldCandidate, "Comitted", 1, 300),
          ]);
        } catch (error) {
          console.error("Error fetching old candidate data:", error);
        }
      }

      const candidateStaked = stakedUserList.find(
        (user: any) => user.user.id === candidate
      );
      if (candidateStaked) {
        stakeOfCandidate = candidateStaked.stakedAmount;
      }
      
      if (SeigManager_CONTRACT && DepositManager_CONTRACT && Old_DepositManager_CONTRACT) {
        try {
          if (account) {
            stakeOf = await SeigManager_CONTRACT.stakeOf(candidateContract, account);
            myPending = await DepositManager_CONTRACT.pendingUnstaked(candidateContract, account);
            stakeOfCandidate = await SeigManager_CONTRACT.stakeOf(candidateContract, candidate);

            if (mobile && stakeOf !== "0" && TON_CONTRACT) {
              const blockNumber = await library.getBlockNumber();
              const totAddress = await SeigManager_CONTRACT.tot();
              const TotContract = getContract(totAddress, Coinage, library, account);
              const coinageAddress = await SeigManager_CONTRACT.coinages(candidateContract);
              const coinageContract = getContract(coinageAddress, Coinage, library, account);

              const userStaked = await coinageContract.balanceOf(account);
              const tonTotalSupply = await TON_CONTRACT.totalSupply();
              const totTotalSupply = await TotContract.totalSupply();
              const tonBalanceOfWTON = await TON_CONTRACT.balanceOf(
                CONTRACT_ADDRESS.WTON_ADDRESS
              );
              const relativeSeigRate = await SeigManager_CONTRACT.relativeSeigRate();

              const tos = toBN(tonTotalSupply)
                .mul(toBN("1000000000"))
                .add(toBN(totTotalSupply))
                .sub(toBN(tonBalanceOfWTON));
              const fromBlockNumber = await SeigManager_CONTRACT.lastCommitBlock(candidateContract);

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

          const pending = await DepositManager_CONTRACT.pendingUnstakedLayer2(candidateContract);
          if (oldCandidate) {
            const oldPending = await Old_DepositManager_CONTRACT.pendingUnstakedLayer2(oldCandidate);
            sumPending = pending.add(oldPending);
          } else {
            sumPending = pending;
          }
        } catch (error) {
          console.error("Error fetching candidate contract data:", error);
        }
      }

      return {
        ...candidateObj,
        stakeOf: stakeOf ? stakeOf.toString() : "0.00",
        expSeig: expSeig ? parseFloat(expSeig) / Math.pow(10, 27) : 0,
        pending: sumPending ? sumPending.toString() : "0.00",
        stakeOfCandidate: stakeOfCandidate ? stakeOfCandidate.toString() : "0.00",
        oldHistory,
        oldCommitHistory,
        myPending,
        index,
      };
    }

    fetchCandidates();
  }, [
    candidates,
    account,
    chainId,
    txPending,
    library,
    SeigManager_CONTRACT,
    DepositManager_CONTRACT,
    Old_DepositManager_CONTRACT,
    TON_CONTRACT,
    mobile,
  ]);

  return { candidateList };
}
