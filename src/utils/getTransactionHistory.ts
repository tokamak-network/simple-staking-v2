

export function getTransactionHistory (data: any) {
  const {staked, unstaked, withdrawal} = data
  const concatData = staked.concat(unstaked).concat(withdrawal)
  const txData = concatData.sort(function (a: any, b: any) {
    return a.timestamp - b.timestamp;
  })
  return txData
}