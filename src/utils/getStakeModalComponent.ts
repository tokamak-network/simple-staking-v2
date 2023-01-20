export function getStakeModalComponent (type: string | undefined, data: any) {
  const modalComponent = {
    staking: {
      header: 'Staking',
      subHeader: 'You can earn TON and Power',
      balanceInfo: 'TON Balance',
      balance: data.tonBalance,
      bottomComment: 'Minimum staking amount is 5',
      buttonName: 'Stake',
    },
    unstaking: {
      header: 'Unstake',
      subHeader: 'Do you really want unstake your TON now?',
      balanceInfo: 'Available Balance',
      balance: data.stakedAmount,
      bottomComment: 'Withdrawal delay is about 2 weeks',
      buttonName: 'UnStake',
    },
    restaking: {
      header: 'Re-Staking',
      subHeader: 'You can earn TON and Power',
      balanceInfo: 'Re-stake Amount',
      balance: data.pendingUnstaked,
      bottomComment: '',
      buttonName: 'Re-Stake',
    },
    withdraw: {
      header: 'Withdraw',
      subHeader: 'Do you really want withdraw your TON now?',
      balanceInfo1: 'Staked Balance',
      balance1: data.stakedAmount,
      balanceInfo2: 'Withdrawable Balance',
      balance: data.withdrawable,
      bottomComment: '',
      buttonName: 'Withdraw'
    }
  }
  //@ts-ignore
  return modalComponent[type]
}