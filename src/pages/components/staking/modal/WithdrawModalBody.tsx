import { Flex, Text } from "@chakra-ui/react";

export const WithdrawModalBody = (args: { title: string; value: any }) => {
	const { title, value } = args;

	return (
		<Flex
			w={"80%"}
			flexDir={"row"}
			justifyContent={"space-between"}
			alignItems={"center"}
			h={"55px"}
			mb={"10px"}
		>
			<Text
				fontSize={"13px"}
				fontWeight={500}
				color={"#808992"}
				textAlign={"left"}
			>
				{title}
			</Text>
			<Text
				fontSize={"18px"}
				fontWeight={500}
				color={"#3d495d"}
				textAlign={"right"}
			>
				{value} TON
			</Text>
		</Flex>
	);
};

export default WithdrawModalBody;
