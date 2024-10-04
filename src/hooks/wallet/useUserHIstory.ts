import { getOperatorUserHistory, getOperatorsInfo } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { useBlockNumber } from '../useBlockNumber';
import { GET_HISTORY } from '@/graphql/query/getUserHIstory';
import { useQuery } from '@apollo/client';
import { getTransactionHistory } from '../../utils/getTransactionHistory';
import { useGetUserHistory } from '../graphql/useGetUserHistory';

export function useUserHistory () {
  const [userHistory, setUserHistory] = useState([])
  const { blockNumber } = useBlockNumber()
  const { account } = useWeb3React();
  
  const { users } = useGetUserHistory(account)

  useEffect(() => {
    async function fetchList () {  
      if (account && users) {
        const pastData = await getOperatorsInfo();

        let myHistory: any = []
        await Promise.all(pastData.map(async (obj: any) => {
          const history = await getOperatorUserHistory(obj.layer2.toLowerCase(), account.toLowerCase())
          myHistory = [...myHistory, ...history]
          return await myHistory
        }))
        myHistory = myHistory.sort(function (a: any, b: any) {
          return b.blockNumber - a.blockNumber
        })
        if (users[0]) {
          const txData = getTransactionHistory({...users[0], oldHistory: myHistory})
          setUserHistory(txData)
        }
      }
    }
    fetchList()
  }, [account, users])

  return { userHistory }
}