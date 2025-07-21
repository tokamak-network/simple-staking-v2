import axios from "axios";
import { API } from "@/constants";
import { DEFAULT_NETWORK } from "@/constants/index";
import { PRICE_API } from "@/constants";

function createInstatnceCandidate() {
	return axios.create({
		baseURL: API,
	});
}

function priceInstance() {
	return axios.create({
		baseURL: PRICE_API,
	});
}

const price = priceInstance();
const candidate = createInstatnceCandidate();

export async function getTONPrice() {
	// const res = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-tokamak')
	const res = await price.get("/tonprice");

	return res.data;
}

export async function getEvent(event: string) {
	const events = ["ChangedMember", "ChangedSlotMaximum"];
	const eventsString = events.join(",");
	const res = await candidate.get("/events", {
		params: {
			chainId: DEFAULT_NETWORK,
			page: 1,
			pagesize: 1000,
			eventNames: eventsString,
		},
	});
	return res.data.datas;
}

export async function getDailyStakedTotal() {
	const res = await candidate.get("/stakedtotals", {
		params: {
			chainId: DEFAULT_NETWORK,
		},
	});
	return res.data === "" ? [] : res.data.datas;
}

export async function getOperatorsInfo() {
	const res = await candidate.get("/layer2s/operators", {
		params: {
			chainId: DEFAULT_NETWORK,
		},
	});

	return res.data === "" ? [] : res.data.datas;
}

export async function getDailyWalletRewards(
	account: string,
	fromDate: string,
	toDate: string,
) {
	const res = await candidate.get("/stakedl2accounts/rewards", {
		params: {
			chainId: DEFAULT_NETWORK,
			account: account.toLowerCase(),
			fromDate: fromDate,
			toDate: toDate,
		},
	});

	return res.data === "" ? [] : res.data.datas;
}

export async function getEventByLayer2(
	layer2: string,
	eventName: string,
	pageNum?: number,
	pageSize?: number,
) {
	const res = await candidate.get("/events", {
		params: {
			chainId: DEFAULT_NETWORK,
			layer2: layer2,
			eventName: eventName,
			page: pageNum,
			pagesize: pageSize,
		},
	});
	return res.data === "" ? [] : res.data.datas;
}

export async function getDepositTotal(account: string) {
	const res = await candidate.get("/events", {
		params: {
			chainId: DEFAULT_NETWORK,
			from: account.toLowerCase(),
			eventName: "Deposited",
		},
	});
	return res.data === "" ? [] : res.data.datas;
}

export async function getWithdrawTotal(account: string) {
	const res = await candidate.get("/events", {
		params: {
			chainId: DEFAULT_NETWORK,
			from: account.toLowerCase(),
			eventName: "WithdrawalRequested",
		},
	});
	return res.data === "" ? [] : res.data.datas;
}

export async function getOperatorUserHistory(layer2: string, from?: string) {
	const res = await candidate.get("/events", {
		params: {
			chainId: DEFAULT_NETWORK,
			eventNames: "Deposited,WithdrawalRequested,WithdrawalProcessed",
			layer2: layer2,
			from: from,
		},
	});
	return res.data === "" ? [] : res.data.datas;
}

// export async function getCommitHistory (layer2: string) {
//   const res = await candidate.get('/events', {
//     params: {
//       chainId: DEFAULT_NETWORK,
//       eventName: 'Comitted',
//       layer2: layer2,
//       page: 1,
//       pagesize: 300,
//     },
//   });
//   return res.data === '' ? [] : res.data.datas;
// }

export async function getUSDInfo() {
	const res = await axios.get("https://api.frankfurter.app/latest?from=KRW");
	return res.data.rates.USD;
}

export async function getTotalSupply() {
	const res = await axios.get("https://price.api.tokamak.network/totalsupply");
	return res.data;
}

export async function getTotalStaked() {
	const res = await axios.get(
		"https://price.api.tokamak.network/staking/current",
	);
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
