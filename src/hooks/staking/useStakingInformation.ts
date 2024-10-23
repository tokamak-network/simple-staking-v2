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
}

export function useStakingInformation () {
  const [stakingInfo, setStakingInfo] = useState<SupplyValueProps[]>([
    {
      title: "Total staked",
      tooltip: "",
      value: 0,
      dollor: 0,
      unit: 'TON'
    },
    {
      title: "Average APY",
      tooltip: "",
      value: 0,
      dollor: 0,
      unit: '%'
    },
    {
      title: "Seigniorage emission",
      tooltip: "",
      value: 0,
      dollor: 0,
      unit: 'TON per day'
    },
  ])
  const { dailyStaked, totalStaked } = useDailyStaked();


  useEffect(() => {
    async function fetch() {      
      setStakingInfo([
        {
          title: "Total staked",
          tooltip: "",
          tooltip2: "",
          value: totalStaked.toLocaleString(undefined, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }),
          // dollor: Total staked * tonPriceUSD,
          unit: 'TON'
        },
        {
          title: "Average APY",
          tooltip: "tooltip",
          tooltip2: "",
          value: `~${dailyStaked[0].roi}`,
          // dollor: (Total staked + Average APY) * tonPriceUSD,
          unit: '%'
        },
        {
          title: "Seigniorage emission",
          tooltip: "seigPerDay",
          tooltip2: "",
          value: `~28,224`,
          // dollor: (circulation.totalCirculationSupply) * tonPriceUSD,
          unit: 'TON per day'
        },
      ])
    }
    fetch()
  }, [totalStaked])
  
  return { 
    stakingInfo
  };
}