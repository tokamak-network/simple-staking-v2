export function getStakeModalComponent (type: string | undefined, data: any) {
  const modalComponent = {
    staking: {
      header: 'Stake',
      subHeader: '',
      balanceInfo: 'Balance',
      balance: data.tonBalance,
      balance2: data.wtonBalance,
      bottomComment: 'Recommended minimum staking amount is 5 TON.',
      buttonName: 'Stake',
    },
    unstaking: {
      header: 'Unstake',
      subHeader: 'Unstaking TON will stop the staking rewards.',
      balanceInfo: 'Unstakable Balance',
      balance: data.stakedAmount,
      bottomComment: `your unclaimed stakng reward (${data.seig} TON) before unstaking to avoid losing it.`,
      buttonName: 'Unstake',
    },
    restaking: {
      header: 'Restake',
      subHeader: 'Restake unstaked TON to continue earning staking rewards.',
      balanceInfo: 'Restakable Balance',
      balance: data.pendingUnstaked,
      bottomComment: '',
      buttonName: 'Restake',
    },
    withdraw: {
      header: 'Withdraw',
      subHeader: 'Withdraw unstaked TON to your wallet.',
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