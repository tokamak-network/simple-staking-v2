import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getDailyStakedTotal,getTotalSupply,getTotalStaked } from '@/api';

export function useDailyStaked () {
    const [dailyStaked, setDailyStaked] = useState([]);
    const [totalStaked, setTotalStaked] = useState<number>(0);
    useEffect(()=> {
      async function fetchData() {
        const dailyStakedTotal = await getDailyStakedTotal();
        const totalStakedCurrent:number = await getTotalStaked();
        const totalSup = await getTotalSupply();
      
        dailyStakedTotal.forEach((item:any) => {
          const totalStaked = parseFloat(item.totalSupply) / Math.pow(10, 27);
          let my = Number(1000);
          let stakedRatio = 0;
          const unit = 365;
          const maxCompensate = Number('26027.39726');
          const total = Number(totalStaked) + my;
          stakedRatio = total / totalSup;
          const compensatePerDay = stakedRatio * 26027.39726;
          const dailyNotMintedSeig =
            maxCompensate - maxCompensate * (total / totalSup);
          const proportionalSeig = dailyNotMintedSeig * (40 / 100);
          const expectedSeig =
            (my / total) * (Number(compensatePerDay) + proportionalSeig) * unit;
          my = my + expectedSeig;
          // item.roi = (my/Number(1000)*100 - 100)/100;
          item.roi = (((my / Number(1000)) * 100 - 100) / 100).toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }
          );
        });
        setDailyStaked(dailyStakedTotal) 
        setTotalStaked(totalStakedCurrent)             
      }
      fetchData()
    },[])
 return {dailyStaked,totalStaked}
}