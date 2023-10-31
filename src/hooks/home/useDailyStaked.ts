import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getDailyStakedTotal,getTotalSupply,getTotalStaked } from '@/api';
import { useQuery } from '@apollo/client';
import { GET_GRAPH } from '../../graphql/getGraphdata';
import moment from 'moment';

export function useDailyStaked () {
    const [dailyStaked, setDailyStaked] = useState([]);
    const [totalStaked, setTotalStaked] = useState<number>(0);

    const { data } = useQuery(GET_GRAPH, {
      pollInterval: 10000
    });

    useEffect(()=> {
      async function fetchData() {
        
        const dailyStakedTotal = await getDailyStakedTotal();
        const totalStakedCurrent:number = await getTotalStaked();
        const totalSup = await getTotalSupply();
        
        const stakingDayData = data?.stakingDayDatas.map((obj: any) => {
          let tempObj 
          const date = new Date(obj.date * 1000)
          
          let fetchDateUTC = moment(date).utc().format('YYYYMMDD')
          // console.log(obj.totalStaked)
          tempObj = {
            blockTime: obj.date * 1000,
            fetchDateUTC: Number(fetchDateUTC),
            totalSupply: obj.totalStaked
          }

          return tempObj
        })
        
        const filteredData = dailyStakedTotal.filter((item: any) => item.fetchDateUTC < 20231024)
        const concatData = stakingDayData.concat(filteredData)

        const graphdata = concatData.map((item:any) => {
          // console.log(item.totalSupply)
          const totalStaked = parseFloat(item.totalSupply ) / Math.pow(10, 27);
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
          let roi = (((my / Number(1000)) * 100 - 100) / 100).toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }
          );

          let fixedData = {
            ...item,
            roi: roi
          }
          return fixedData
        });
        
        setDailyStaked(graphdata)
        setTotalStaked(totalStakedCurrent)             
      }
      fetchData()
    },[])
 return {dailyStaked,totalStaked}
}