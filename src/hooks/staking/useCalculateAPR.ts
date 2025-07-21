import { getCommitHistory } from "@/utils/getTransactionHistory";
import { useState, useEffect } from "react";
import { useStakingInformation } from "./useStakingInformation";
import useCallContract from "../useCallContract";

export function useCalculateAPR(data: any) {
	const commitHistory = getCommitHistory(data);
	const { roi } = useStakingInformation();
	const [compound, setCompound] = useState("00.00");
	const month = 2629743;
	const now = Date.now();

	let compounds = [];
	for (let i = 0; i < 12; i++) {
		const a = commitHistory?.find((history: any) => {
			return (
				history.timestamp < now / 1000 - month * i &&
				history.timestamp > now / 1000 - (i + 1) * month
			);
		});

		a ? compounds.push(a) : a;
	}

	useEffect(() => {
		async function fetch() {
			if (roi === 0) {
				setCompound("0.35");
			}
			if (roi !== 0 && roi !== Infinity) {
				const apr = roi;

				const commissionRate = data.commissionRate;
				const commission = Number(commissionRate.toString()) / 1e27;

				const convertedAPR = apr === 0 ? 0.35 : Number(apr) / 100;
				const numOfCompounds = compounds.length === 0 ? 1 : compounds.length;
				const expectedAPR =
					(1 + (convertedAPR * (1 - Number(commission))) / numOfCompounds) **
						numOfCompounds -
					1;

				setCompound(
					(expectedAPR * 100).toLocaleString(undefined, {
						maximumFractionDigits: 2,
						minimumFractionDigits: 2,
					}),
				);
			}
		}

		fetch();
	}, [roi]);

	return compound;
}
