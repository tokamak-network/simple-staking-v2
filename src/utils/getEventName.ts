
export function getEventName (eventName: string) {
  return eventName === 'WithdrawalRequested' ? 'Unstake'
    : eventName === 'Deposited' ? 'Stake'
    : eventName === 'WithdrawalProcessed' ? 'Withdraw' :
    eventName
}
