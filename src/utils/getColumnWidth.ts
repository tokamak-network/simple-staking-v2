export function getColumnWidthStaking(tableType: string, columnName: string) {
	return tableType === "Transactions" &&
		(columnName === "Account" || columnName === "account")
		? "110px"
		: tableType === "Update Seigniorage" && columnName === "txHash"
			? "80px"
			: tableType === "Transactions" &&
					(columnName === "Type" || columnName === "txType")
				? "110px"
				: tableType === "Transactions" &&
						(columnName === "Amount" || columnName === "amount")
					? "150px"
					: columnName === "Time" ||
							columnName === "date" ||
							columnName === "Last Updated"
						? "220px"
						: "";
}

export function getColumnWidthWallet(columnName: string) {
	return columnName === "index"
		? "70px"
		: columnName === "txHash" || columnName === "contractAddress"
			? "160px"
			: columnName === "txType"
				? "170px"
				: columnName === "amount"
					? "190px"
					: columnName === "blockNumber"
						? "360px"
						: "";
}

export function getColumnWidthWalletMobile(columnName: string) {
	return columnName === "txHash"
		? "33.2%"
		: columnName === "txType"
			? "26.2%"
			: columnName === "amount"
				? "30%"
				: columnName === "status"
					? "13.9%"
					: "";
}

export function getColumnWidthWithdraw(columnName: string) {
	return columnName === "amount"
		? "180px"
		: columnName === "status"
			? "140px"
			: "";
}
