export function getTransactionHistory(data: any) {
	if (data) {
		const { staked, unstaked, withdrawal, oldHistory, withdrawL2 } = data;
		if (staked && unstaked && withdrawal && withdrawL2) {
			let concatData = staked
				.concat(unstaked)
				.concat(withdrawal)
				.concat(withdrawL2);
			if (oldHistory) concatData = concatData.concat(oldHistory);
			const txData = concatData.sort(function (a: any, b: any) {
				return b.timestamp - a.timestamp;
			});
			return txData;
		}
	}
}

export function getCommitHistory(data: any) {
	if (data) {
		const { asCommit, oldCommitHistory } = data;
		let concatData = asCommit;
		if (oldCommitHistory) {
			concatData = asCommit.concat(oldCommitHistory);
			concatData = concatData.sort(function (a: any, b: any) {
				return b.timestamp - a.timestamp;
			});
		}

		let datas = [];
		for (let i = 0; i < concatData.length; i++) {
			const indexedData = {
				...concatData[i],
				index: concatData.length - i - 1,
			};
			datas.push(indexedData);
		}

		return datas;
	}
}
