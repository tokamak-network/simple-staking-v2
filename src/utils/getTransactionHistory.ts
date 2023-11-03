

export function getTransactionHistory (data: any) {
  const {staked, unstaked, withdrawal, oldHistory} = data
  if (oldHistory) {
    const concatData = staked.concat(unstaked).concat(withdrawal).concat(oldHistory)
    const txData = concatData.sort(function (a: any, b: any) {
      return b.timestamp - a.timestamp;
    })
    return txData
  }
}

export function getCommitHistory (data: any) {
  const {asCommit, oldCommitHistory} = data
  if (oldCommitHistory) {
    const concatData = asCommit.concat(oldCommitHistory)
    const commitData = concatData.sort(function (a: any, b: any) {
      return b.timestamp - a.timestamp;
    })
    return commitData
  }
}