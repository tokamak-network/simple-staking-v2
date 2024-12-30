import { getTotalSupply } from '@/api';
import { calculateRoiBasedonCompound } from '@/components/calculateRoi';
import { duration } from 'moment';
import { useState, useEffect } from 'react';
import { useDailyStaked } from '../home/useDailyStaked';

import { useTONPrice } from './useTONPrice';

type SupplyValueProps = {
  title: string;
  tooltip: string;
  tooltip2?: string;
  unit: string
  value: string | number;
  dollor?: number | string
  width?: string;
}

export function useStakingInformation () {

  const [stakingInfo, setStakingInfo] = useState<SupplyValueProps[]>([
    {
      title: "Staking APY",
      tooltip: "Staking APY varies among DAO candidates. The rate depends on how frequently stakers update seigniorage for their chosen DAO candidate, since staking rewards compound with each update.",
      value: 0,
      dollor: 0,
      unit: '%'
    },
    {
      title: "Total staked",
      tooltip: "",
      value: 0,
      dollor: 0,
      unit: 'TON'
    },
    {
      title: "Seigniorage emission",
      tooltip: "",
      value: 0,
      dollor: 0,
      unit: 'TON per day'
    },
  ])
  const {totalStaked } = useDailyStaked();
  
  useEffect(() => {
    async function fetch() {  
      const totalSup = await getTotalSupply();  
      const roi = calculateRoiBasedonCompound({
        totalStakedAmount: totalStaked,
        totalSupply: totalSup,
        duration: '1-year'
      })
      
      setStakingInfo([
        {
          title: "Staking APY",
          tooltip: "Staking APY varies among DAO candidates. The rate depends on how frequently stakers update seigniorage for their chosen DAO candidate, since staking rewards compound with each update.",
          tooltip2: "",
          value: `~${roi ? roi.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2}) : 0.00}`,
          // dollor: (Total staked + Average APY) * tonPriceUSD,
          unit: '%',
          width: '325px'
        },
        {
          title: "Total staked",
          tooltip: "",
          tooltip2: "",
          value: totalStaked.toString() === 'NaN' ? '0.00' : totalStaked.toLocaleString(undefined, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }),
          // dollor: Total staked * tonPriceUSD,
          unit: 'TON'
        },
        {
          title: "Seigniorage emission",
          tooltip: "3.92 TON is minted with each Ethereum block and distributed as follows: TON stakers (74%), DAO (20%), PowerTON holders (0%), and L2 operators (6%).",
          tooltip2: "",
          value: `~28,224`,
          // dollor: (circulation.totalCirculationSupply) * tonPriceUSD,
          unit: 'TON per day',
          width: '470px'
        },
      ])
    }
    fetch()
  }, [totalStaked])
  
  return { 
    stakingInfo
  };
}