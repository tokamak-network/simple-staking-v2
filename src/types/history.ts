import { Result } from "ethers/lib/utils";

export type SentMessages = {
	blockNumber: string;
	blockTimestamp: string;
	gasLimit: string;
	message: string;
	messageNonce: BigInt;
	sender: string;
	target: string;
	transactionHash: string;
};

export type Erc20Type = {
	id: string;
	_l1Token: string;
	_l2Token: string;
	_from: string;
	_amount: string;
	_data: string;
	_to: string;
	blockNumber: string;
	blockTimestamp: string;
	transactionHash: string;
};

export type EthType = {
	id: string;
	_from: string;
	_amount: string;
	_data: string;
	_to: string;
	blockNumber: string;
	blockTimestamp: string;
	transactionHash: string;
};

export type L1TxType = SentMessages | Erc20Type | EthType;

export type DepositTx = SentMessages &
	L1TxType & {
		event: string;
	};

export type UserL2Transaction = {
	address: string;
	args?: Result | undefined;
	blockHash: string;
	blockNumber: number;
	data: string;
	decode?: any;
	event?: string | undefined;
	eventSignature?: string | undefined;
	getBlock: any;
	getTransaction: any;
	logIndex: number;
	removeListener: any;
	removed: boolean;
	topics: string[];
	transactionHash: string;
	transactionIndex: number;
};

export type Block = {
	hash: string;
	parentHash: string;
	number: number;
	timestamp: number;
	nonce: string;
};
export type Receipt = {
	blockHash: string;
	blockNumber: number;
	chainId: number;
	confirmations: number;
	data: string;
	from: string;
	hash: string;
	nonce: number;
	r: string;
	s: string;
	to: string;
	transactionIndex: number;
	type: number;
	v: number;
	value: BigInt;
};

export type FullDepTx = Receipt & {
	address: string;
	args?: Result | undefined;
	event?: string | undefined;
	eventSignature?: string | undefined;
	getTransaction: any;
	getTransactionReceipt: any;
	l1Block: Block;
	l1BlockNumber: number;
	l1TxOrigin: string;
	l1timeStamp: number;
	l1txHash: string;
	l2timeStamp: number;
	l2txHash: string;
	logIndex: number;
	queueOrigin: string;
	rawTransaction: string;
	removeListener: any;
	removed: boolean;
	topics: string[];
	transactionHash: string;
	txType: undefined;
	_amount: string;
	_l1Token: string;
	_l2Token: string;
};

export type Resolved = {
	target: string;
	sender: string;
	message: string;
	messageNonce: BigInt;
};

export type FullWithTx = Erc20Type &
	SentMessages & {
		currentStatus: number;
		event: string;
		l1Block: string;
		l1timeStamp: string;
		l1txHash: string;
		l2TxReceipt: Receipt;
		l2timeStamp: string;
		l2txHash: string;
		resolved: Resolved;
		timeReadyForRelay: number | string;
	};

export type tData = {
	loadingState: "present" | "loading" | "absent";
	depositTxs: any[];
};
