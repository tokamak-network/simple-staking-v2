import { range } from 'lodash'
import { useBlockNumber } from '../useBlockNumber';
import useCallContract from '../useCallContract';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { convertNumber } from '../../utils/number';

export function useWithdrawable (layer2: string) {
  const { blockNumber } = useBlockNumber()
  const { DepositManager_CONTRACT } = useCallContract();
  const { account } = useWeb3React();
  const [withdrawable, setWithdrawable] = useState('0.00')
  const [notWithdrawable, setNotWithdrawable] = useState('0.00')
  const [withdrawableLength, setWithdrawableLength] = useState('0.00')


  useEffect(() => {
    async function fetch () {
      let numPendingRequests
      let initial = BigNumber.from('0')
      const pendingRequests: any = [];
      if (account && DepositManager_CONTRACT) {
        numPendingRequests = await DepositManager_CONTRACT.numPendingRequests(layer2, account)
        let requestIndex = await DepositManager_CONTRACT.withdrawalRequestIndex(layer2, account)
        for (const _ of range(numPendingRequests)) {
          pendingRequests.push(await DepositManager_CONTRACT.withdrawalRequest(layer2, account, requestIndex));
          requestIndex++;
        }
        
      const withdrawbleList = pendingRequests.filter((request: any) => parseInt(request.withdrawableBlockNumber) <= blockNumber)
       const notWithdrawableList = pendingRequests.filter((request: any) => parseInt(request.withdrawableBlockNumber) > blockNumber)
    
       setWithdrawableLength(withdrawbleList.length)
        const reducer = (amount:any, request: any) => amount.add(request.amount)
        const withdrawableAmount = withdrawbleList.reduce(reducer, initial)
        const notWithdrawableAmount = notWithdrawableList.reduce(reducer, initial) 
        

        const convert = convertNumber({
          amount: withdrawableAmount.toString(),
          type: 'ray',
          localeString: true
        })

        const convertNotWithdrawable = convertNumber({
          amount: notWithdrawableAmount.toString(),
          type: 'ray',
          localeString: true
        })
        
        if (convert) setWithdrawable(convert)
        if (convertNotWithdrawable) setNotWithdrawable(convertNotWithdrawable)
              
      }
    }
    fetch ()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DepositManager_CONTRACT, account, layer2, withdrawable, blockNumber])

  return {withdrawable, withdrawableLength, notWithdrawable}
}