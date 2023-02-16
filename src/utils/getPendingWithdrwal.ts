import { BigNumber } from 'ethers';

export async function getPendingWithdrwal (history: any) {
  const block = 16275066 - 93046;
  const requested = history.filter((history: any) => history.eventName === 'WithdrawalRequested');
  const processed = history.filter((history: any) => history.eventName === 'WithdrawalProcessed');
  const stake = history.filter((history: any) => history.eventName === 'Deposited');
  let withdrawAmount = requested.filter((request:any) => request.blockNumber < block);
  withdrawAmount = requested.filter((request: any) => {
    return !processed.some((other: any) => other.data.amount === request.data.amount);
  })
  withdrawAmount = withdrawAmount.filter((request: any) => {
    return !stake.some((other: any) => other.data.amount === request.data.amount && other.from === request.from);
  })
  let pendingWithdraw = BigNumber.from('0');
  
  withdrawAmount.map((request: any) => {
    pendingWithdraw = pendingWithdraw.add(BigNumber.from(request.data.amount));
  })
  
  return pendingWithdraw
}
