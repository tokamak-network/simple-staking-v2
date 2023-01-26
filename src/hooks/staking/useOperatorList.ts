import { getEventByLayer2, getOperatorsInfo, getDelegators, getCandidateCreateEvent, getOperatorUserHistory, getCandidates } from "@/api";
import { useEffect, useState } from 'react';
import { NON_CANDIDATE } from "@/constants";
import { useWeb3React } from '@web3-react/core';
import { convertNumber } from '../../utils/number';
import useCallContract from '../useCallContract';
import { BigNumber } from 'ethers';
import { calculateExpectedSeig } from "tokamak-staking-lib";
import { BN, toBN } from 'web3-utils';
import useContract from "hooks/useContract";
import AutoRefactorCoinageABI from 'services/abi/AutoRefactorCoinage.json';
import Layer2ABI from 'services/abi/Layer2.json'
import { getContract } from "utils/getContract";
import CONTRACT_ADDRESS from "services/addresses/contract";
import { BASE_PROVIDER } from "@/constants";
import { range } from 'lodash';

export function useOperatorList() {
  const [operatorList, setOperatorList] = useState([]);
  const [totalStaked, setTotalStaked] = useState('0.00')
  const { account, library } = useWeb3React();
  const { DepositManager_CONTRACT, SeigManager_CONTRACT, TON_CONTRACT, WTON_CONTRACT } = useCallContract();
  const {

    WTON_ADDRESS,

  } = CONTRACT_ADDRESS;
  useEffect(() => {
    async function fetchList() {
      const data = await getOperatorsInfo();
      const provider = BASE_PROVIDER;

      let staked = BigNumber.from('0')
      const operators = await Promise.all(data.map(async (obj: any) => {
        const history = await getOperatorUserHistory(obj.layer2.toLowerCase())
        const commitHistory = await getEventByLayer2(obj.layer2.toLowerCase(), 'Comitted', 1, 300)
        const blockNumber = library && await library.getBlockNumber();
        const candidates = await getCandidates()
        const events = await getCandidateCreateEvent();
        const Layer2 = getContract(obj.layer2, Layer2ABI, library)
        const delegators = await getDelegators(obj.layer2.toLowerCase())
        const candidateContractCreated = events.filter(
          (event: any) => event.eventName === 'CandidateContractCreated'
        );

        const isCandidate = candidates.find(
          (candidate: any) => candidate.layer2 === obj.layer2.toLowerCase()
        );

        let deployedAt;
        if (isCandidate.kind === 'candidate') {
          const candi = candidateContractCreated.filter(
            (candidate: any) =>
              candidate.data.candidateContract.toLowerCase() === obj.layer2.toLowerCase()
          );
          const block = await provider.getBlock(candi[0]?.txInfo.blockNumber)
          deployedAt = block.timestamp;
        }
        else if (isCandidate.kind !== 'candidate' ||
          isCandidate.kind === '' ||
          isCandidate.kind === 'layer2') {
          const [firstEpoch] = await Promise.all([
            Layer2.getEpoch(0, 0),
          ]);
          deployedAt = firstEpoch.timestamp.toString();
        }

        let pendingUnstakedLayer2
        let stakeOf = '0'
        let commisionRates = undefined
        let seigniorage;
        let userNotWithdrawable;
        let userWithdrawable;
        let delayedCommissionRateNegative;
        let delayedCommissionRate;
        let delayedCommissionBlock; 
        let withdrawalDelay;
        let globalWithdrawalDelay;
        if (DepositManager_CONTRACT) {
          pendingUnstakedLayer2 = await DepositManager_CONTRACT.pendingUnstakedLayer2(obj.layer2)
        }

        if (account && SeigManager_CONTRACT) {
          stakeOf = await SeigManager_CONTRACT.stakeOf(obj.layer2, account)
          commisionRates = await SeigManager_CONTRACT.commissionRates(obj.layer2)
        }

        const pendingWithdrawal = pendingUnstakedLayer2 ? convertNumber({
          amount: pendingUnstakedLayer2.toString(),
          type: 'ray',
          localeString: true,
        }) : '-'
        staked = staked.add(stakeOf)
        const yourStaked = convertNumber({
          amount: stakeOf.toString(),
          type: 'ray',
          localeString: true
        })
        const commissionRate = commisionRates ? convertNumber({
          amount: commisionRates.toString(),
          type: 'wei',
        }) : '-'



        if (account && SeigManager_CONTRACT && TON_CONTRACT && DepositManager_CONTRACT) {
          const Tot = getContract(await SeigManager_CONTRACT.tot(), AutoRefactorCoinageABI, library, account)
          const coinage = getContract(await SeigManager_CONTRACT.coinages(obj.layer2), AutoRefactorCoinageABI, library, account)
          const Layer2 = getContract(obj.layer2, Layer2ABI, library)
          const userStaked = await coinage.balanceOf(account)

          const tonTotalSupply = await TON_CONTRACT.totalSupply();
          const totTotalSupply = await Tot.totalSupply()
          const tonBalanceOfWTON = await TON_CONTRACT.balanceOf(WTON_ADDRESS)
          const relativeSeigRate = await SeigManager_CONTRACT.relativeSeigRate()
          const tos = toBN(tonTotalSupply)
            .mul(toBN('1000000000'))
            .add(toBN(totTotalSupply))
            .sub(toBN(tonBalanceOfWTON));
          const fromBlockNumber = await SeigManager_CONTRACT.lastCommitBlock(obj.layer2)
          seigniorage = calculateExpectedSeig(
            new BN(fromBlockNumber.toString()),
            new BN(blockNumber),
            new BN(userStaked.toString()),
            new BN(totTotalSupply.toString()),
            new BN(tos),
            new BN(relativeSeigRate.toString())
          );

         
          const numPendingRequests = await DepositManager_CONTRACT.numPendingRequests(obj.layer2, account)
          let requestIndex = await DepositManager_CONTRACT.withdrawalRequestIndex(obj.layer2, account)
          const pendingRequests = [];
          for (const _ of range(numPendingRequests)) {
            pendingRequests.push(await
              DepositManager_CONTRACT.withdrawalRequest(obj.layer2, account, requestIndex)

            );
            requestIndex++;
          }
          Promise.all(pendingRequests);

          const notWithdrawableRequests = pendingRequests.filter((request: any) =>
            parseInt(request.withdrawableBlockNumber) > blockNumber
          )

          const withdrawableRequests = pendingRequests.filter((request: any) =>
          parseInt(request.withdrawableBlockNumber) <= blockNumber
        )
        
          const initialAmount = BigNumber.from('0')
          const reducer = (amount: any, request: any) => amount.add(request.amount)
          userNotWithdrawable = notWithdrawableRequests.reduce(reducer, initialAmount)
          userWithdrawable = withdrawableRequests.reduce(reducer, initialAmount)
        
           delayedCommissionRate = await SeigManager_CONTRACT.delayedCommissionRate(obj.layer2);
           delayedCommissionRateNegative = await SeigManager_CONTRACT.delayedCommissionRateNegative(obj.layer2);
           delayedCommissionBlock = await SeigManager_CONTRACT.delayedCommissionBlock(obj.layer2);

           withdrawalDelay = await DepositManager_CONTRACT.withdrawalDelay(obj.layer2)
           globalWithdrawalDelay = await DepositManager_CONTRACT.globalWithdrawalDelay()
           
          }


        const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        const fetchedData = {
          ...obj,
          operatorsHistory: history,
          delegators: delegators.length,
          commit: commitHistory,
          pendingWithdrawal: pendingWithdrawal,
          yourStaked: yourStaked,
          userSeigs: seigniorage,
          commissionRate: commissionRate,
          deployedAt: deployedAt,
          userNotWithdrawable: userNotWithdrawable.toString(),
          userWithdrawable: userWithdrawable.toString(),
          delayedCommissionRateNegative:delayedCommissionRateNegative,
          delayedCommissionRate:convertNumber({
            amount: delayedCommissionRate.toString(),
            type: 'wei',
          }),
          delayedCommissionBlock: delayedCommissionBlock,
          withdrawalDelay:withdrawalDelay,
          globalWithdrawalDelay:globalWithdrawalDelay,
   
        }
        // const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        return find ?
          await { ...fetchedData, name: find.name } : await fetchedData
      }))

      setTotalStaked(staked.toString())
      if (operators) {
        operators.sort(function (a: any, b: any) {
          return b.updateCoinageTotalString - a.updateCoinageTotalString
        })
        //@ts-ignore
        setOperatorList(operators)
      }
    }
    fetchList()
  }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account, setTotalStaked])

  return { operatorList, totalStaked }
}

export default useOperatorList