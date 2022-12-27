import { getEventByLayer2, getOperatorsInfo, getDelegators, getOperatorUserHistory } from "@/api";
import { useEffect, useState } from 'react';
import { NON_CANDIDATE } from "@/constants";
import { useWeb3React } from '@web3-react/core';
import { ConsoleView } from "react-device-detect";
import { convertNumber } from '../../utils/number';
import useCallContract from '../useCallContract';

export function useOperatorList() {
  const [operatorList, setOperatorList] = useState([]);
  const { account, library } = useWeb3React();
  const { DepositManager_CONTRACT , SeigManager_CONTRACT} = useCallContract();

  useEffect(() => {
    async function fetchList () {
      const data = await getOperatorsInfo();

      const operators = await Promise.all(data.map(async (obj: any) => {
        const history = await getOperatorUserHistory(obj.layer2.toLowerCase())
        const commitHistory = await getEventByLayer2(obj.layer2.toLowerCase(), 'Comitted', 1, 300)
        
        const delegators = await getDelegators(obj.layer2.toLowerCase())
        
        let pendingUnstakedLayer2
        let stakeOf = '0'
        let commisionRates = undefined

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
        const yourStaked =  convertNumber({
          amount: stakeOf.toString(),
          type: 'ray',
          localeString: true
        })
        const commissionRate = commisionRates ? convertNumber({
          amount: commisionRates.toString(),
          type: 'wei',
        }) : '-'

        const fetchedData = {
          ...obj, 
          operatorsHistory: history, 
          delegators: delegators.length,
          commit: commitHistory,
          pendingWithdrawal: pendingWithdrawal,
          yourStaked: yourStaked,
          commissionRate: commissionRate
        }
        const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        return find ? 
          await { ...fetchedData, name: find.name } : await fetchedData
      }))
      
      if (operators) {
        operators.sort(function(a: any, b: any) {
          return b.updateCoinageTotalString - a.updateCoinageTotalString
        })
        //@ts-ignore
        setOperatorList(operators)
      }
    }
    fetchList()
  }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account])

  return { operatorList }
}

export default useOperatorList