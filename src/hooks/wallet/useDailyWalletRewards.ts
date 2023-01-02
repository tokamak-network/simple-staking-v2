import { getDailyWalletRewards } from '@/api';
import {useState, useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';

export function useDailyWalletRewards (start: string, end: string) {
  const [dailyWalletRewards, setDailyWalletRewards] = useState()
  const {account} = useWeb3React();

  useEffect(()=> {
    async function fetchData () {
      if (account) {
        const data = await getDailyWalletRewards(account?.toLowerCase(), start, end)
        if (data.length !== 0) {
          
        }
      }
      
    }
    fetchData()
    return dailyWalletRewards
  }, [])
}
