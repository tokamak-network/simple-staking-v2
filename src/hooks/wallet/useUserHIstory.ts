import { getOperatorUserHistory, getOperatorsInfo } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { useBlockNumber } from '../useBlockNumber';
import { GET_HISTORY } from '@/graphql/getUserHIstory';
import { useQuery } from '@apollo/client';
import { getTransactionHistory } from '../../utils/getTransactionHistory';

export function useUserHistory () {
  const [userHistory, setUserHistory] = useState([])
  const { blockNumber } = useBlockNumber()
  const { account } = useWeb3React();
  const {data} = useQuery(GET_HISTORY, {
    variables: {
      id: account?.toLowerCase()
    },
    pollInterval: 10000
  });
  const { DepositManager_CONTRACT , SeigManager_CONTRACT} = useCallContract();

  useEffect(() => {
    async function fetchList () {  
      if (account && data) {
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
        if (data.users[0]) {
          const txData = getTransactionHistory({...data.users[0], oldHistory: myHistory})
          setUserHistory(txData)
        }

      }
    }
    fetchList()
  }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account, blockNumber, data])

  return { userHistory }
}