import axios from 'axios';
import { API } from '@/constants';

function createInstatnceCandidate () {
  return axios.create({
    baseURL: API,
  });
}

const candidate = createInstatnceCandidate();

export async function getDailyStakedTotal (chainId: number) {
  const res = await candidate.get('/stakedtotals', {
    params: {
      chainId: chainId,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getOperatorsInfo () {
  const res = await candidate.get('/layer2s/operators', {
    params: {
      chainId: 1,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getDailyWalletRewards (chainId: number, account: string, fromDate: number, toDate: number) {
  const res = await candidate.get('/stakedl2accounts/rewards', {
    params: {
      chainId,
      account: account.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getCandidateCreateEvent () {
  const res = await candidate.get('/events', {
    params: {
      eventNames: 'CandidateContractCreated,Layer2Registered',
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getDepositTotal (chainId: number, account: string) {
  const res = await candidate.get('/events',
    {
      params: {
        chainId,
        from: account.toLowerCase(),
        eventName: 'Deposited',
      },
    });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getWithdrawTotal (chainId: number, account: string) {
  const res = await candidate.get('/events',
    {
      params: {
        chainId,
        from: account.toLowerCase(),
        eventName: 'WithdrawalRequested',
      },
    });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getOperatorUserHistory (chainId: number, layer2: string) {
  const res = await candidate.get('/events', {
    params: {
      chainId: chainId,
      eventNames: 'Deposited,WithdrawalRequested,WithdrawalProcessed',
      layer2: layer2,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getCommitHistory (chainId: number, layer2: string) {
  const res = await candidate.get('/events', {
    params: {
      chainId: chainId,
      eventName: 'Comitted',
      layer2: layer2,
      page: 1,
      pagesize: 300,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getDailyWalletStaked (chainId: number, account: string, fromDate: number, toDate: number) {
  const res = await candidate.get('/stakedl2accounts/sum', {
    params: {
      chainId,
      account: account.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getDelegators (chainId: number, layer2: string) {
  const res = await candidate.get('/layer2users', {
    params: {
      chainId: chainId,
      layer2: layer2,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getAccumulatedReward (chainId: number, user: string) {
  const res = await candidate.get('/stakedl2accounts/totalRewards', {
    params: {
      chainId: chainId,
      account: user,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getCandidates () {
  const res = await candidate.get('/layer2s/operators');
  if (res.data === '') return [];
  else return res.data.datas;
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
  const res =  await axios.get('https://price-api.tokamak.network/totalsupply');
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
