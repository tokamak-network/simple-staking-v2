import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getWithdrawTotal } from "@/api";

export function useDailyWithdrawals() {
	const [dailyWithdrawAmnts, setDailyWithdrawAmnts] = useState([]);
	const { account } = useWeb3React();

	useEffect(() => {
		async function fetchData() {
			if (account) {
				const data = await getWithdrawTotal(account.toLowerCase());
				if (data.length !== 0) {
					setDailyWithdrawAmnts(data);
				}
			}
		}

		fetchData();
	}, [account]);

	return { dailyWithdrawAmnts };
}
