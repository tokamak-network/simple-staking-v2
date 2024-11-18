import { range } from 'lodash'
import { useBlockNumber } from '../useBlockNumber';
import useCallContract from '../useCallContract';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { calcCountDown2, convertNumber } from '../../utils/number';
import { getOldLayerAddress } from '../../utils/getOldLayerAddress';
import { getCountdown } from '@/api';
import { useRecoilState, useRecoilValue } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useGetWithdrawalAndDeposited } from '../graphql/useGetWithdrawalAndDeposited';

export function useWithdrawable (layer2: string) {
  const { blockNumber } = useBlockNumber()
  const { DepositManager_CONTRACT, Old_DepositManager_CONTRACT } = useCallContract();
  const { account } = useWeb3React();
  
  const [withdrawable, setWithdrawable] = useState('0.00')
  const [notWithdrawable, setNotWithdrawable] = useState('0.00')
  const [withdrawableLength, setWithdrawableLength] = useState('0.00')

  const [requests, setRequests] = useState<any[]>([])

  const [old_withdrawable, old_setWithdrawable] = useState('0.00')
  const [old_notWithdrawable, old_setNotWithdrawable] = useState('0.00')
  const [old_withdrawableLength, old_setWithdrawableLength] = useState('0.00')

  useEffect(() => {
    async function fetch () {
      try {
        let numPendingRequests
        let old_numPendingRequests
        
        let initial = BigNumber.from('0')
        const pendingRequests: any = [];
        const old_pendingRequests: any = [];
        
        if (account && DepositManager_CONTRACT && Old_DepositManager_CONTRACT && layer2) {
          const old_address = getOldLayerAddress(layer2)
          numPendingRequests = await DepositManager_CONTRACT.numPendingRequests(layer2, account)
          let requestIndex = await DepositManager_CONTRACT.withdrawalRequestIndex(layer2, account)

          for (const _ of range(numPendingRequests)) {
            pendingRequests.push(await DepositManager_CONTRACT.withdrawalRequest(layer2, account, requestIndex));
            requestIndex++;
          }
          setRequests(pendingRequests)
          
          const withdrawbleList = pendingRequests.filter(
            (request: any) => parseInt(request.withdrawableBlockNumber) <= blockNumber
          )
          const notWithdrawableList = pendingRequests.filter(
            (request: any) => parseInt(request.withdrawableBlockNumber) > blockNumber
          )

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

          if (old_address) {
            old_numPendingRequests = await Old_DepositManager_CONTRACT.numPendingRequests(old_address, account)
            let old_requestIndex = await Old_DepositManager_CONTRACT.withdrawalRequestIndex(old_address, account)
            for (const _ of range(old_numPendingRequests)) {
              old_pendingRequests.push(
                await Old_DepositManager_CONTRACT.withdrawalRequest(old_address, account, old_requestIndex)
              );
              old_requestIndex++;
            }
    
            const old_withdrawbleList = old_pendingRequests.filter(
              (request: any) => parseInt(request.withdrawableBlockNumber) <= blockNumber
            )
            const old_notWithdrawableList = old_pendingRequests.filter(
              (request: any) => parseInt(request.withdrawableBlockNumber) > blockNumber
            )
            
            old_setWithdrawableLength(old_withdrawbleList.length)
            const old_withdrawableAmount = old_withdrawbleList.reduce(reducer, initial)
            const old_notWithdrawableAmount = old_notWithdrawableList.reduce(reducer, initial)
    
            const old_convert = convertNumber({
              amount: old_withdrawableAmount.toString(),
              type: 'ray',
              localeString: true
            })
    
            const old_convertNotWithdrawable = convertNumber({
              amount: old_notWithdrawableAmount.toString(),
              type: 'ray',
              localeString: true
            })
  
            if (old_convert) old_setWithdrawable(old_convert)
            if (old_convertNotWithdrawable) old_setNotWithdrawable(old_convertNotWithdrawable)
          }

        }
      } catch (e) {
        console.log(e)
      }
    }
    fetch ()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    layer2, 
  ])
  return {
    withdrawable, 
    withdrawableLength, 
    notWithdrawable,
    old_withdrawable, 
    old_withdrawableLength, 
    old_notWithdrawable,
    requests
  }
}

export function useWithdrawRequests () {
  const { DepositManager_CONTRACT } = useCallContract();
  const { account, library } = useWeb3React();
  const { blockNumber } = useBlockNumber()
  const [txPending, ] = useRecoilState(txState);
  
  const withdrawRequests = useCallback(
    async (layer2: string) => {
      if (account && DepositManager_CONTRACT && layer2) {
        const pendingRequests: any = [];
        const numPendingRequests = await DepositManager_CONTRACT.numPendingRequests(layer2, account)
        let requestIndex = await DepositManager_CONTRACT.withdrawalRequestIndex(layer2, account)
        const currentBlock = await library.getBlock('latest')
        const requestIdx = requestIndex.toString()
        for (const _ of range(numPendingRequests)) {
          const request = await DepositManager_CONTRACT.withdrawalRequest(layer2, account, requestIndex)
          
          const withdrawableBlock = request.withdrawableBlockNumber.toString()
          const withdrawable = withdrawableBlock < currentBlock.number ? true : false
          const withdrawableTime = withdrawable ? 'Withdrawable' : await getCountdown(withdrawableBlock)
          const data = {
            amount: request.amount,
            time: withdrawableTime === 'Withdrawable' ? 'Withdrawable' : calcCountDown2(withdrawableTime.EstimateTimeInSec),
            requestIndex: requestIndex,
            withdrawableBlock: withdrawableBlock
            // process: request.process
          }

          pendingRequests.push(data);
          requestIndex++;
        }
        return pendingRequests
      }
  }, [txPending])
  
  return {withdrawRequests}
}

export function useWithdrawalAndDeposited () {
  const [txPending, ] = useRecoilState(txState);
  const { account } = useWeb3React();

  const { withdrawalAndDepositeds } = useGetWithdrawalAndDeposited()
  
  const request = useCallback(
    async (layer2: string) => {
      if (withdrawalAndDepositeds && account) {
        const filter = withdrawalAndDepositeds.filter((data: any) => {
          return data.candidate.id === layer2 && data.sender === account.toLowerCase()
        })
        return filter
      }
    }, [withdrawalAndDepositeds, txPending, account])
  return { request }
}