import { getDailyWalletRewards } from '@/api';
import {useState, useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';

export function useDailyWalletRewards (start: string, end: string) {
  const [dailyWalletRewards, setDailyWalletRewards] = useState()
  const {account} = useWeb3React();


  useEffect (() => {
    fetchData(start, end)
  },[account])

    async function fetchData (start: string, end: string) {
      if (account) {
        const data = await getDailyWalletRewards(account?.toLowerCase(), start, end);        
        if (data.length !== 0) {
          setDailyWalletRewards(data)
        //  console.log(data);
         
          return data
        
        }
      }
    
    }

  return { fetchData, dailyWalletRewards}
}
