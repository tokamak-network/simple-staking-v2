import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { convertNumber } from '../../utils/number';
import { useRecoilState } from 'recoil';
import { txState } from '@/atom/global/transaction';

export function useGetStakeOf (layer2: string, account: string | null | undefined) {
  const [stakeOf, setStakeOf] = useState('0.00')
  const { SeigManager_CONTRACT } = useCallContract();
  const [txPending, ] = useRecoilState(txState);
  
  useEffect(() => {
    async function fetchList () {  
      if (account && SeigManager_CONTRACT && layer2) {
        const stakedAmount = await SeigManager_CONTRACT.stakeOf(layer2, account)
        const converted = convertNumber({
            amount: stakedAmount.toString(),
            type: 'ray',
            localeString: true,
        })
        if (converted) setStakeOf(converted)
      } 
    }
    fetchList()
  }, [SeigManager_CONTRACT, account, layer2, txPending])

  return { stakeOf }
}