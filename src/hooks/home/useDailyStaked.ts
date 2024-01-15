import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getDailyStakedTotal, getTotalSupply, getTotalStaked } from '@/api';
import { useQuery } from '@apollo/client';
import { GET_GRAPH, GET_FACTORY } from '../../graphql/getGraphdata';
import moment from 'moment';
import { calculateRoi } from '@/components/calculateRoi';

export function useDailyStaked() {
  const [dailyStaked, setDailyStaked] = useState<any[]>([]);
  const [totalStaked, setTotalStaked] = useState<number>(0);

  const { data } = useQuery(GET_GRAPH, {
    pollInterval: 10000,
  });

  const factory = useQuery(GET_FACTORY, {
    pollInterval: 10000,
  });

  useEffect(() => {
    async function fetchData() {
      const dailyStakedTotal = await getDailyStakedTotal();
      // const totalStakedCurrent: number = await getTotalStaked();
      const totalSup = await getTotalSupply();
      const stakeTotal = factory.data?.factories[0].totalStaked;
      const totalStake = parseFloat(stakeTotal) / Math.pow(10, 27);

      function pushToArray(date: number, stakeAmount: string) {
        const day = new Date(date * 1000);
        const fetchDay = moment(day).utc().format('YYYYMMDD');
        return {
          blockTime: date * 1000,
          fetchDateUTC: Number(fetchDay),
          totalSupply: stakeAmount,
        };
      }
      let filledData = [];
      if (data) {
        const { stakingDayDatas } = data;
        const day = 86400;
        const now = Math.floor(new Date().getTime() / 1000);
        const sinceLastday = Math.floor((now - stakingDayDatas[0].date) / day);
        // input staked ton data in the end of graph
        for (let i = 1; i < sinceLastday + 1; i++) {
          const today = (stakingDayDatas[0].date) + day * i;
          if (today > 0) {
            filledData.push(pushToArray(today, stakingDayDatas[0].totalStaked));
          }
        }
        for (let i = 0; i < stakingDayDatas.length; i++) {
          filledData.push(pushToArray(stakingDayDatas[i].date, stakingDayDatas[i].totalStaked));
          // fill staked data in the middle of graph
          if (stakingDayDatas[i + 1]) {
            const gap = Math.floor((stakingDayDatas[i].date - stakingDayDatas[i + 1].date) / day);
            for (let j = 1; j < gap; j++) {
              const date2 = stakingDayDatas[i].date - day;
              filledData.push(pushToArray(date2, stakingDayDatas[i + 1].totalStaked));
            }
          }
        }
      }
      //@ts-ignore
      const setData = [...new Set(filledData.map(JSON.stringify))].map(JSON.parse)

      const filteredData = dailyStakedTotal.filter((item: any) => item.fetchDateUTC < 20231024);
      const concatData = setData?.concat(filteredData);
      const graphdata = concatData?.map((item: any, index) => {
        const totalStaked = parseFloat(item.totalSupply) / Math.pow(10, 27);
        let my = Number(1000);
        let stakedRatio = 0;
        const unit = 365;
        const maxCompensate = Number('26027.39726');
        const total = Number(totalStaked) + my;
        stakedRatio = total / totalSup;
        const compensatePerDay = stakedRatio * 26027.39726;
        const dailyNotMintedSeig = maxCompensate - maxCompensate * (total / totalSup);
        const proportionalSeig = dailyNotMintedSeig * (40 / 100);
        const expectedSeig = (my / total) * (Number(compensatePerDay) + proportionalSeig) * unit;
        my = my + expectedSeig;

        const test = calculateRoi(totalStaked, totalSup);

        // if (index === 0) {
        //   console.log(totalStaked, totalSup);
        // }

        // item.roi = (my/Number(1000)*100 - 100)/100;
        let roi = test.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });

        let fixedData = {
          ...item,
          roi,
        };
        return fixedData;
      });

      setDailyStaked(graphdata);
      setTotalStaked(totalStake);
    }
    fetchData();
  }, [data, factory]);
  return { dailyStaked, totalStaked };
}
