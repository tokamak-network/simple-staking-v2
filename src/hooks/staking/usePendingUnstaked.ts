import { useEffect, useState } from "react";
import useCallContract from "../useCallContract";
import { convertNumber } from "../../utils/number";

export function usePendingUnstaked(
	layer2: string,
	account: string | null | undefined,
) {
	const [pendingUnstaked, setPendingUnstaked] = useState("0.00");
	const { DepositManager_CONTRACT } = useCallContract();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchList() {
			if (account && DepositManager_CONTRACT && layer2) {
				const pendingUnstakedAmount =
					await DepositManager_CONTRACT.pendingUnstaked(layer2, account);

				if (pendingUnstakedAmount) {
					setPendingUnstaked(pendingUnstakedAmount);
					setLoading(false);
				}
			}
		}
		fetchList();
	}, [DepositManager_CONTRACT, account, layer2]);

	return { pendingUnstaked, loading };
}
