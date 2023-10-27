export function getStakeModalComponent (type: string | undefined, data: any) {
  const modalComponent = {
    staking: {
      header: 'Staking',
      subHeader: 'You can earn TON and Power',
      balanceInfo: 'TON Balance',
      balance: data.tonBalance,
      bottomComment: 'Recommended minimum staking amount is 5 TON.',
      buttonName: 'Stake',
    },
    unstaking: {
      header: 'Unstake',
      subHeader: 'Do you really want unstake your TON now?',
      balanceInfo: 'Available Balance',
      balance: data.stakedAmount,
      bottomComment: `your unclaimed stakng reward (${data.seig} TON) before unstaking to avoid losing it.`,
      buttonName: 'Unstake',
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
      balance2: data.old_withdrawable,
      balance3: data.withdrawable,
      bottomComment: '',
      buttonName: 'Withdraw'
    }
  }
  //@ts-ignore
  return modalComponent[type]
}