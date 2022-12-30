import { getOperatorUserHistory, getOperatorsInfo } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

export function useUserHistory () {
  const [userHistory, setUserHistory] = useState([])
  const { account } = useWeb3React();

  useEffect(() => {
    async function fetchList () {  
      if (account) {
        const data = await getOperatorsInfo();
        let myHistory: any = []
        await Promise.all(data.map(async (obj: any) => {
          const history = await getOperatorUserHistory(obj.layer2.toLowerCase(), account.toLowerCase())
          myHistory = [...myHistory, ...history]
          return await myHistory
        }))
        setUserHistory(myHistory)
      }
    }
    fetchList()
  }, [account])

  return { userHistory }
}