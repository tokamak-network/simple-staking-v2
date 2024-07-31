
import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { convertNumber } from '../../utils/number';

export function useWithdrawDelay (layer2: string) {
  const [checkDelay, setCheckDelay] = useState(true)
  const { DepositManager_CONTRACT } = useCallContract();
  
  useEffect(() => {
    async function fetch () {  
      if (DepositManager_CONTRACT && layer2) {
        const withdrawDelay = await DepositManager_CONTRACT.withdrawalDelay(layer2)
        const globalWithdrawDelay = await DepositManager_CONTRACT.globalWithdrawalDelay()
        const condition = +(withdrawDelay.toString()) > 216000
        setCheckDelay(condition)
      } 
    }
    fetch()
  }, [DepositManager_CONTRACT, layer2])

  return checkDelay
}