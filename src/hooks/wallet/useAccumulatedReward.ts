import { getAccumulatedReward } from '@/api';
import {useState, useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';
import { convertNumber } from '@/components/number';

export function useAccumulatedReward () {
  const [accumulatedReward, setAccumulatedReward] = useState<string>('0.00');
  const { account } = useWeb3React();

  useEffect(() => {
    async function fetchData () {
      if (account) {
      const data = await getAccumulatedReward(account.toLowerCase())
        const reward = convertNumber({
          amount: data[0].rewards.toLocaleString('fullwide', {
            useGrouping: false,
          }),
          type: 'ray',
          localeString: true
        })
        if (reward) setAccumulatedReward(reward)
      }
    }
    fetchData()
  }, [account, accumulatedReward])
  return { accumulatedReward }
}
