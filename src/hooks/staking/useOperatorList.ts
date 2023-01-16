import { getEventByLayer2, getOperatorsInfo, getDelegators, getOperatorUserHistory } from "@/api";
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
import { getContract } from "utils/getContract";
import CONTRACT_ADDRESS from "services/addresses/contract";


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
      let staked = BigNumber.from('0')
      const operators = await Promise.all(data.map(async (obj: any) => {
        const history = await getOperatorUserHistory(obj.layer2.toLowerCase())
        const commitHistory = await getEventByLayer2(obj.layer2.toLowerCase(), 'Comitted', 1, 300)
        const blockNumber = library && await library.getBlockNumber();

        const delegators = await getDelegators(obj.layer2.toLowerCase())

        let pendingUnstakedLayer2
        let stakeOf = '0'
        let commisionRates = undefined
        let seigniorage;
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



        if (account && SeigManager_CONTRACT && TON_CONTRACT) {
          const Tot = getContract(await SeigManager_CONTRACT.tot(), AutoRefactorCoinageABI, library, account)
          const coinage = getContract(await SeigManager_CONTRACT.coinages(obj.layer2), AutoRefactorCoinageABI, library, account)
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
        }        

        const fetchedData = {
          ...obj,
          operatorsHistory: history,
          delegators: delegators.length,
          commit: commitHistory,
          pendingWithdrawal: pendingWithdrawal,
          yourStaked: yourStaked,
          userSeigs: seigniorage,
          commissionRate: commissionRate
        }
        const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
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