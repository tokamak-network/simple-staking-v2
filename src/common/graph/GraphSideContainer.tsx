import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { GraphSideComponent } from "./GraphSideComponent";

type GraphSideContainerProps = {
	totalReward: string;
	totalStaked: string;
	totalWithdraw: string;
};

export const GraphSideContainer: FC<GraphSideContainerProps> = ({
	totalReward,
	totalStaked,
	totalWithdraw,
}) => {
	return (
		<Flex flexDir={"column"} w={"100%"} mt={"70px"}>
			<Text mb={"25px"} color={"#808992"}>
				Analysis of Reward
			</Text>
			<GraphSideComponent title={"Total Reward"} value={totalReward} />
			<GraphSideComponent title={"Total Staked"} value={totalStaked} />
			<GraphSideComponent title={"Total Withdraw"} value={totalWithdraw} />
		</Flex>
	);
};

export default GraphSideContainer;
