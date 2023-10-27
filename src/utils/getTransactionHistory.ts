

export function getTransactionHistory (data: any) {
  const {staked, unstaked, withdrawal, oldHistory} = data
  const concatData = staked.concat(unstaked).concat(withdrawal).concat(oldHistory)
  const txData = concatData.sort(function (a: any, b: any) {
    return b.timestamp - a.timestamp;
  })
  return txData
}