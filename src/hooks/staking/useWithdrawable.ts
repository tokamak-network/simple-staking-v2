import { range } from 'lodash'
import { useBlockNumber } from '../useBlockNumber';
import useCallContract from '../useCallContract';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { calcCountDown2, convertNumber } from '../../utils/number';
import { getOldLayerAddress } from '../../utils/getOldLayerAddress';
import { useRecoilState, useRecoilValue } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useGetWithdrawalAndDeposited } from '../graphql/useGetWithdrawalAndDeposited';

export function useWithdrawable(layer2: string | undefined) {
  const { blockNumber } = useBlockNumber();
  const { DepositManager_CONTRACT, Old_DepositManager_CONTRACT } = useCallContract();
  const { account } = useWeb3React();

  const [withdrawable, setWithdrawable] = useState('0.00');
  const [notWithdrawable, setNotWithdrawable] = useState('0.00');
  const [withdrawableLength, setWithdrawableLength] = useState('0');

  const [requests, setRequests] = useState<any[]>([]);

  const [old_withdrawable, old_setWithdrawable] = useState('0.00');
  const [old_notWithdrawable, old_setNotWithdrawable] = useState('0.00');
  const [old_withdrawableLength, old_setWithdrawableLength] = useState('0');

  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    if (!layer2 || !account || !DepositManager_CONTRACT || !Old_DepositManager_CONTRACT) {
      return;
    }

    let cancelled = false;

    async function fetchWithdrawableData() {
      try {
        setWithdrawLoading(true);

        const initial = BigNumber.from('0');
        const pendingRequests: any[] = [];

        const numPendingRequests = await DepositManager_CONTRACT?.numPendingRequests(layer2, account);
        let requestIndex = await DepositManager_CONTRACT?.withdrawalRequestIndex(layer2, account);

        for (const _ of range(numPendingRequests)) {
          const req = await DepositManager_CONTRACT?.withdrawalRequest(layer2, account, requestIndex);
          pendingRequests.push(req);
          requestIndex = requestIndex.add(1);
        }

        if (!cancelled) {
          setRequests(pendingRequests);
        }

        const withdrawableList = pendingRequests.filter(
          (req) => req.withdrawableBlockNumber.toNumber() <= blockNumber
        );
        const notWithdrawableList = pendingRequests.filter(
          (req) => req.withdrawableBlockNumber.toNumber() > blockNumber
        );

        const wLen = withdrawableList.length;
        
        const reduceAmount = (acc: BigNumber, req: any) => acc.add(req.amount);
        const withdrawableAmount = withdrawableList.reduce(reduceAmount, initial);
        const notWithdrawableAmount = notWithdrawableList.reduce(reduceAmount, initial);

        const convertedW = convertNumber({
          amount: withdrawableAmount.toString(),
          type: 'ray',
          localeString: true
        });
        const convertedNW = convertNumber({
          amount: notWithdrawableAmount.toString(),
          type: 'ray',
          localeString: true
        });

        // 상태 저장
        if (!cancelled) {
          setWithdrawableLength(String(wLen));
          setWithdrawable(convertedW || '0.00');
          setNotWithdrawable(convertedNW || '0.00');
        }

        const oldAddress = layer2 ? getOldLayerAddress(layer2) : undefined;
        if (oldAddress) {
          const old_pendingRequests: any[] = [];
          if (Old_DepositManager_CONTRACT) {
            const old_numPendingRequests = await Old_DepositManager_CONTRACT.numPendingRequests(
              oldAddress,
              account
            );
            let old_requestIndex = await Old_DepositManager_CONTRACT.withdrawalRequestIndex(
              oldAddress,
              account
            );

            for (const _ of range(old_numPendingRequests)) {
              const old_req = await Old_DepositManager_CONTRACT.withdrawalRequest(
                oldAddress,
                account,
                old_requestIndex
              );
              old_pendingRequests.push(old_req);
              old_requestIndex = old_requestIndex.add(1);
            }
          }

          const old_withdrawableList = old_pendingRequests.filter(
            (req) => req.withdrawableBlockNumber.toNumber() <= blockNumber
          );
          const old_notWithdrawableList = old_pendingRequests.filter(
            (req) => req.withdrawableBlockNumber.toNumber() > blockNumber
          );

          const old_wLen = old_withdrawableList.length;
          const old_withdrawableAmount = old_withdrawableList.reduce(reduceAmount, initial);
          const old_notWithdrawableAmount = old_notWithdrawableList.reduce(reduceAmount, initial);

          const old_convertedW = convertNumber({
            amount: old_withdrawableAmount.toString(),
            type: 'ray',
            localeString: true
          });
          const old_convertedNW = convertNumber({
            amount: old_notWithdrawableAmount.toString(),
            type: 'ray',
            localeString: true
          });

          if (!cancelled) {
            old_setWithdrawableLength(String(old_wLen));
            old_setWithdrawable(old_convertedW || '0.00');
            old_setNotWithdrawable(old_convertedNW || '0.00');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setWithdrawLoading(false);
        }
      }
    }

    fetchWithdrawableData();

    return () => {
      cancelled = true;
    };
  }, [
    layer2,
    account,
    blockNumber,
    DepositManager_CONTRACT,
    Old_DepositManager_CONTRACT
  ]); 

  return {
    withdrawable,
    notWithdrawable,
    withdrawableLength,
    requests,
    old_withdrawable,
    old_notWithdrawable,
    old_withdrawableLength,
    withdrawLoading
  };
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
        let withdrawDelay = await DepositManager_CONTRACT.withdrawalDelay(layer2)
        let globalWithdrawalDelay = await DepositManager_CONTRACT.globalWithdrawalDelay()
        
        withdrawDelay = Number(withdrawDelay.toString()) > Number(globalWithdrawalDelay.toString()) ? 
          Number(withdrawDelay.toString()) : Number(globalWithdrawalDelay.toString())
        
        const currentBlock = await library.getBlock('latest')
        const requestIdx = requestIndex.toString()
        for (const _ of range(numPendingRequests)) {
          const request = await DepositManager_CONTRACT.withdrawalRequest(layer2, account, requestIndex)
          
          const withdrawableBlock = request.withdrawableBlockNumber.toString()
          const withdrawable = withdrawableBlock < currentBlock.number ? true : false
          const remainTimes = (withdrawableBlock - currentBlock.number) * 12
          const withdrawableTime = withdrawable ? 'Withdrawable' : remainTimes.toString()

          const data = {
            amount: request.amount,
            time: withdrawableTime === 'Withdrawable' ? 'Withdrawable' : calcCountDown2(withdrawableTime),
            requestIndex: requestIndex,
            withdrawableBlock: withdrawableBlock,
            // process: request.process
            withdrawDelay: Number(withdrawDelay.toString())
          }

          pendingRequests.push(data);
          requestIndex++;
        }
        
        return pendingRequests
      }
  }, [txPending])
  
  return { withdrawRequests }
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