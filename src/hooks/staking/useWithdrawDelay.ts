
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
        // console.log(withdrawDelay.toString(), withdrawDelay.toString() === '0')
        const condition = 
          withdrawDelay.toString() === '0' 
          ? false
          : withdrawDelay.gt(globalWithdrawDelay) 
          ? true
          : false
        setCheckDelay(condition)
      } 
    }
    fetch()
  }, [DepositManager_CONTRACT, layer2])

  return checkDelay
}