// import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";
import { ZERO_ADDRESS } from "@/constants";

export function useL2CandidateInfo(data: any) {
	const { TON_CONTRACT } = useCallContract();

	const [balance, setBalance] = useState("0");
	// let balance
	useEffect(() => {
		async function fetch() {
			if (TON_CONTRACT && data !== null) {
				const isBedrock = data.portal === ZERO_ADDRESS ? false : true;
				const balance = await TON_CONTRACT.balanceOf(
					isBedrock ? data.portal : data.bridge,
				);
				// console.log(balance.toString())
				setBalance(balance.toString());
			}
		}
		fetch();
	}, []);
	return balance;
}
