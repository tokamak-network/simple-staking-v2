import { WithdrawTypeSelector } from "@/common/selector/WithdrawType";
import { useWithdrawRequests } from "@/hooks/staking/useWithdrawable";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MobileUnstake } from "./MobileUnstake";
import { MobileWithdrawToEthereum } from "./MobileWithdrawToEthereum";

type MobileToEthereumProps = {
	selectedOp: any;
	onClose: any;
};

export function MobileToEthereum(args: MobileToEthereumProps) {
	const { selectedOp, onClose } = args;
	const [tab, setTab] = useState("unstake");
	const [requests, setRequests] = useState();
	const { withdrawRequests } = useWithdrawRequests();

	useEffect(() => {
		const fetch = async () => {
			if (selectedOp) {
				const withdrawRequest = await withdrawRequests(
					selectedOp.candidateContract,
				);
				setRequests(withdrawRequest);
			}
		};
		fetch();
	}, [selectedOp]);

	return (
		<Flex flexDir={"column"} h={"100%"}>
			<WithdrawTypeSelector tab={tab} setTab={setTab} />
			{tab === "unstake" ? (
				<MobileUnstake selectedOp={selectedOp} onClose={onClose} />
			) : (
				<MobileWithdrawToEthereum
					selectedOp={selectedOp}
					requests={requests}
					onClose={onClose}
					toggle={"Withdraw"}
				/>
			)}
		</Flex>
	);
}

export default MobileToEthereum;
