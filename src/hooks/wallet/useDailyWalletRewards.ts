import { getDailyWalletRewards } from '@/api';
import {useState, useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';

export function useDailyWalletRewards (start: string, end: string) {
  const [dailyWalletRewards, setDailyWalletRewards] = useState()
  const {account} = useWeb3React();


  useEffect (() => {
    fetchData(start, end)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[account])

    async function fetchData (start: string, end: string) {
      if (account) {
        const data = await getDailyWalletRewards(account?.toLowerCase(), start, end);        
        if (data.length !== 0) {
          setDailyWalletRewards(data)    
          return data        
        }
      }
    }
  return { fetchData, dailyWalletRewards}
}
