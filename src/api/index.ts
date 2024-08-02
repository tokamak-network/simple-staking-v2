import axios from 'axios';
import { API } from '@/constants';
import { DEFAULT_NETWORK } from '@/constants/index';
import { ETHERSCAN_API_KEY, ETHERSCAN_API } from '@/constants'

function createInstatnceCandidate () {
  return axios.create({
    baseURL: API,
  });
}

function createInstanceEtherscan () {
  return axios.create({
    baseURL: ETHERSCAN_API
  })
}

const candidate = createInstatnceCandidate();
const etherscan = createInstanceEtherscan();

export async function getTONPrice() {
  const res = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-TON')
  return res.data[0]
}

export async function getCountdown (blockNumber: number) {
  const res = await etherscan.get('/api', {
    params: {
      module: 'block',
      action: 'getBlockcountdown',
      blockno: blockNumber,
      apikey: ETHERSCAN_API_KEY
    }
  })
  return res.data.result
}

export async function getDailyStakedTotal () {
  const res = await candidate.get('/stakedtotals', {
    params: {
      chainId: DEFAULT_NETWORK,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getOperatorsInfo () {
  const res = await candidate.get('/layer2s/operators', {
    params: {
      chainId: DEFAULT_NETWORK,
    },
  });
  
  return res.data === '' ? [] : res.data.datas;
}

export async function getDailyWalletRewards (account: string, fromDate: string, toDate: string) {
  const res = await candidate.get('/stakedl2accounts/rewards', {
    params: {
      chainId: DEFAULT_NETWORK, 
      account: account.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    },
  });

  return res.data === '' ? [] : res.data.datas;
}

export async function getEventByAccount (account: string, eventName: string) {
  const res = await candidate.get('/events', {
    params: {
      chainId: DEFAULT_NETWORK,
      from: account.toLowerCase(),
      eventName: eventName,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}
export async function getEventByLayer2 (layer2: string, eventName: string, pageNum?: number, pageSize?: number) {
  const res = await candidate.get('/events', {
    params: {
      chainId: DEFAULT_NETWORK, 
      layer2: layer2,
      eventName: eventName,
      page: pageNum,
      pagesize: pageSize,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getCandidateCreateEvent () {
  const res = await candidate.get('/events', {
    params: {
      chainId: DEFAULT_NETWORK,
      eventNames: 'CandidateContractCreated,Layer2Registered',
    },
  });

  return res.data === '' ? [] : res.data.datas;
}

export async function getDepositTotal (account: string) {
  const res = await candidate.get('/events',
    {
      params: {
        chainId: DEFAULT_NETWORK, 
        from: account.toLowerCase(),
        eventName: 'Deposited',
      },
    });
  return res.data === '' ? [] : res.data.datas;
}

export async function getWithdrawTotal (account: string) {
  const res = await candidate.get('/events',
    {
      params: {
        chainId: DEFAULT_NETWORK, 
        from: account.toLowerCase(),
        eventName: 'WithdrawalRequested',
      },
    });
  return res.data === '' ? [] : res.data.datas;
}

export async function getOperatorUserHistory (layer2: string, from?: string) {
  const res = await candidate.get('/events', {
    params: {
      chainId: DEFAULT_NETWORK,
      eventNames: 'Deposited,WithdrawalRequested,WithdrawalProcessed',
      layer2: layer2,
      from: from,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getCommitHistory (layer2: string) {
  const res = await candidate.get('/events', {
    params: {
      chainId: DEFAULT_NETWORK,
      eventName: 'Comitted',
      layer2: layer2,
      page: 1,
      pagesize: 300,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getDailyWalletStaked (account: string, fromDate: number, toDate: number) {
  const res = await candidate.get('/stakedl2accounts/sum', {
    params: {
      chainId: DEFAULT_NETWORK, 
      account: account.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getDelegators (layer2: string) {
  const res = await candidate.get('/layer2users', {
    params: {
      chainId: DEFAULT_NETWORK,
      layer2: layer2,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getAccumulatedReward (user: string) {
  const res = await candidate.get('/stakedl2accounts/totalRewards', {
    params: {
      chainId: DEFAULT_NETWORK,
      account: user,
    },
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getCandidates () {  
  const res = await candidate.get('/layer2s/operators', {
    params: {
      chainId: DEFAULT_NETWORK,
    }
  });
  return res.data === '' ? [] : res.data.datas;
}

export async function getUSDInfo() {
  const res = await axios.get('https://api.frankfurter.app/latest?from=KRW')
  return res.data.rates.USD
}

// export async function getManagers () {
//   const res = await instance.get('/managers');
//   if (res.data === '') return [];
//   else return res.data;
// }

// export async function getOperators () {
//   const res = await instance.get('/operators');
//   if (res.data === '') return [];
//   else return res.data;
// }

// export async function updateOperator (layer2: number, formData: string) {
//   const res = await instance.patch(
//     '/operators',
//     formData,
//     {
//       params: {
//         layer2: layer2,
//       },
//     });
//   return res.data;
// }

// export async function getHistory (user: string) {
//   const res = await instance.get('/history', {
//     params: {
//       account: user,
//     },
//   });
//   return res.data;
// }

export async function getTotalSupply () {
  const res =  await axios.get('https://price.api.tokamak.network/totalsupply');
  return res.data;
}

export async function getTotalStaked() {
  const res = await axios.get('https://price.api.tokamak.network/staking/current');
  return res.data;
  
}

// export async function addHistory (user, history) {
//   await instance.post(
//     '/history',
//     { history },
//     {
//       params: {
//         account: user,
//       },
//     });
// }

// export async function getTransactions (user) {
//   const res = await instance.get('/transactions', {
//     params: {
//       from: user,
//     },
//   });
//   if (res.data === '') return [];
//   else return res.data;
// }

// export async function addTransaction (transaction) {
//   const res = await instance.post(
//     '/transactions',
//     {
//       type: transaction.type,
//       amount: transaction.amount,
//       transactionHash: transaction.transactionHash,
//       target: transaction.target,
//       receipt: transaction.receipt,
//     },
//     {
//       params: {
//         from: transaction.from,
//       },
//     });
//   return res.data;
// }
