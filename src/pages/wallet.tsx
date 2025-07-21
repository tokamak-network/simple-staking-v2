import { Box, Flex, useTheme } from "@chakra-ui/react";
import PageHeader from "./components/layout/PageHeader";
import TopCardContainer from "./components/wallet/TopCardContainer";
import GraphContainer from "./components/wallet/GraphContainer";
import { MyHistoryTable } from "../common/table/wallet/MyHistoryTable";
import { useMemo, useState } from "react";
import { useUserHistory } from "../hooks/wallet/useUserHIstory";
import { convertNumber } from "../utils/number";
import { useTopCardInfo } from "@/hooks/wallet/useTopCardInfo";
import { LoadingDots } from "@/common/Loader/LoadingDots";
import { useWeb3React } from "@web3-react/core";

function Wallet() {
	const theme = useTheme();
	const { account } = useWeb3React();
	const { userHistory, loading } = useUserHistory();
	const [tableLoading, setTableLoading] = useState<boolean>(true);
	const { userTotalStaked, userPendingWithdrawal } = useTopCardInfo();

	const myTotalStaked = userTotalStaked
		? convertNumber({
				amount: userTotalStaked,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const myPendingWithdrawal = userPendingWithdrawal
		? convertNumber({
				amount: userPendingWithdrawal,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const historyColumns = useMemo(
		() => [
			{
				Header: "#",
				accessor: "index",
			},
			{
				Header: "Transaction Hash",
				accessor: "txHash",
			},
			{
				Header: "Operator Contract",
				accessor: "contractAddress",
			},
			{
				Header: "Type",
				accessor: "txType",
			},
			{
				Header: "Amount",
				accessor: "amount",
			},
			{
				Header: "Time",
				accessor: "blockNumber",
			},
		],
		[],
	);

	return (
		<Flex
			minH={"80vh"}
			w={"100%"}
			mt={"36px"}
			flexDir={"column"}
			alignItems={"center"}
		>
			<PageHeader
				title={"Account"}
				subtitle={"Check the status of your assets in the account"}
			/>
			<Flex
				fontFamily={theme.fonts.roboto}
				flexDir={"column"}
				w={"100%"}
				alignItems={"center"}
			>
				<TopCardContainer
					totalStaked={myTotalStaked}
					pendingWithdrawal={myPendingWithdrawal}
					accumulatedReward={""}
				/>
				<Flex mt={loading ? "50px" : "0px"}>
					{!account ? (
						<Flex mt={"100px"}>Please Connect to Wallet</Flex>
					) : loading ? (
						<LoadingDots />
					) : userHistory && userHistory.length > 0 ? (
						<MyHistoryTable
							columns={historyColumns}
							data={userHistory}
							isLoading={tableLoading}
						/>
					) : (
						<Flex mt={"80px"}>No history</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}

export default Wallet;
