import { getOperatorUserHistory, getOperatorsInfo } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { BigNumber } from 'ethers';
import { range } from 'lodash'
import { useBlockNumber } from '../useBlockNumber';

export function useUserHistory () {
  const [userHistory, setUserHistory] = useState([])
  const { blockNumber } = useBlockNumber()
  // const [totalStaked, setTotalStaked] = useState('0.00')
  const { DepositManager_CONTRACT , SeigManager_CONTRACT} = useCallContract();
  const { account } = useWeb3React();

  useEffect(() => {
    async function fetchList () {  
      if (account) {
        const data = await getOperatorsInfo();

        let staked = BigNumber.from('0')
        let myHistory: any = []

        await Promise.all(data.map(async (obj: any) => {
          let stakeOf = '0'

          const history = await getOperatorUserHistory(obj.layer2.toLowerCase(), account.toLowerCase())
          
          if (account && SeigManager_CONTRACT && DepositManager_CONTRACT) {
            stakeOf = await SeigManager_CONTRACT.stakeOf(obj.layer2, account)
          }
          staked = staked.add(stakeOf)

          myHistory = [...myHistory, ...history]
          return await myHistory
        }))
        myHistory.sort(function(a: any, b: any) {
          return b.blockNumber - a.blockNumber
        })
        setUserHistory(myHistory)
      }
    }
    fetchList()
  }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account, blockNumber])

  return { userHistory }
}