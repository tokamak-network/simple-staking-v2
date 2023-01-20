
export function getEventName (eventName: string) {
  return eventName === 'WithdrawalRequested' ? 'Unstaked'
    : eventName === 'Deposited' ? 'Staked'
    : 'Withdraw'
}
