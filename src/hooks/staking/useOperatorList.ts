import { getEventByLayer2, getOperatorsInfo, getDelegators, getOperatorUserHistory } from "@/api";
import { useEffect, useState } from 'react';
import { NON_CANDIDATE } from "@/constants";
import { useWeb3React } from '@web3-react/core';
import { convertNumber } from '@/utils/number';
import useCallContract from '@/hooks/useCallContract';
import { BigNumber } from 'ethers';
import { useRecoilValue } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useWindowDimensions } from "../useWindowDimensions";
// import { useCandidateList } from './useCandidateList';
import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";

export function useOperatorList() {
  const [operatorList, setOperatorList] = useState([]);
  const [userTotalStaked, setUserTotalStaked] = useState('0.00')
  const [totalStaked, setTotalStaked] = useState<string>()
  const { account } = useWeb3React();
  const { DepositManager_CONTRACT, SeigManager_CONTRACT } = useCallContract();
  const tx = useRecoilValue(txState)
  const [width] = useWindowDimensions();
  
  useEffect(() => {
    async function fetchList() {
      const data = await getOperatorsInfo();
      
      let staked = BigNumber.from('0')
      let totalStake: BigNumber = BigNumber.from('0')
      
      const operators = await Promise.all(data.map(async (obj: any) => {
        let pendingUnstakedLayer2 = ''
        let stakeOf = '0'
        let commisionRates = undefined

        const pendingWithdrawal = pendingUnstakedLayer2 ? convertNumber({
          amount: pendingUnstakedLayer2.toString(),
          type: 'ray',
          localeString: true,
        }) : '-'
        
        totalStake = obj.updateCoinageTotalString ? totalStake.add(obj.updateCoinageTotalString) : BigNumber.from('0')
        staked = staked.add(stakeOf)
       
        const commissionRate = '-'
        const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        const fetchedData = {
          ...obj,
          operatorsHistory: history,
          delegators: 0,
          commit: [],
          pendingWithdrawal: pendingWithdrawal,
          yourStaked: '0',
          commissionRate: commissionRate,
   
        }
        return find ?
          await { ...fetchedData, name: find.name } : await fetchedData
      }))

      setTotalStaked(totalStake.toString())
      setUserTotalStaked(staked.toString())

      if (operators) {
        operators.sort(function (a: any, b: any) {
          return b.updateCoinageTotalString - a.updateCoinageTotalString
        })
        //@ts-ignore
        setOperatorList(operators)
      }
    }
    fetchList()
  }, [])

  return { operatorList, userTotalStaked, totalStaked, tx }
}

export default useOperatorList