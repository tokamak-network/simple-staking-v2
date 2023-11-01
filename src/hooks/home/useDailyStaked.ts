import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getDailyStakedTotal,getTotalSupply,getTotalStaked } from '@/api';
import { useQuery } from '@apollo/client';
import { GET_GRAPH, GET_FACTORY } from '../../graphql/getGraphdata';
import moment from 'moment';

export function useDailyStaked () {
  const [dailyStaked, setDailyStaked] = useState<any[]>([]);
  const [totalStaked, setTotalStaked] = useState<number>(0);

  const { data } = useQuery(GET_GRAPH, {
    pollInterval: 10000
  });

  const factory = useQuery(GET_FACTORY, {
    pollInterval: 10000
  });

  useEffect(()=> {
    async function fetchData() {
      
      const dailyStakedTotal = await getDailyStakedTotal();
      // const totalStakedCurrent: number = await getTotalStaked();
      const totalSup = await getTotalSupply();
      const stakeTotal = factory.data?.factories[0].totalStaked
      const totalStake = parseFloat(stakeTotal) / Math.pow(10, 27);
      // if (data.stakingDatas) {

      function pushToArray (date: number, stakeAmount: string) {
        const day = new Date(date * 1000)
        const fetchDay = moment(day).utc().format('YYYYMMDD')
        return {
          blockTime: date * 1000,
          fetchDateUTC: Number(fetchDay),
          totalSupply: stakeAmount
        }
      }

      const {
        stakingDayDatas
      } = data
      
      let filledData = []
      const day = 86400
      for (let i = 0; i < stakingDayDatas.length; i++) {
        const now = Math.floor(new Date().getTime() / 1000)
        const sinceLastday = Math.floor((now - stakingDayDatas[0].date) / day)
        
        for (let i=0; i < sinceLastday ; i ++) {
          const today = (stakingDayDatas[0].date + day) * i
          filledData.push(pushToArray(today, stakingDayDatas[0].totalStaked))
        }

        filledData.push(pushToArray(stakingDayDatas[i].date, stakingDayDatas[i].totalStaked))

        if (stakingDayDatas[i + 1]) {
          const gap = Math.floor((stakingDayDatas[i].date - stakingDayDatas[i + 1].date) / day)

          for (let j = 1; j < gap; j++) {
            const date2 = (stakingDayDatas[i].date - day)
            filledData.push(pushToArray(date2, stakingDayDatas[i + 1].totalStaked))
          }
        } 
      }
      
      
      const filteredData = dailyStakedTotal.filter((item: any) => item.fetchDateUTC < 20231024)
      const concatData = filledData?.concat(filteredData)

      const graphdata = concatData?.map((item:any) => {
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
      setTotalStaked(totalStake)             
    }
    fetchData()
  },[data, factory])
 return { dailyStaked, totalStaked }
}