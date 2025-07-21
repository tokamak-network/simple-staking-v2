import { Flex } from "@chakra-ui/react";

type InfoTypeSelectorProps = {
	tab: any;
	setTab: any;
	type?: string;
};

export const InfoTypeSelector = (args: InfoTypeSelectorProps) => {
	const { tab, setTab, type } = args;

	return (
		<Flex
			w={type === "mobile" ? "100%" : "213px"}
			h={type === "mobile" ? "36px" : "30px"}
			p={"3px"}
			ml={type === "mobile" ? "0px" : "70px"}
			border={"solid 1px #e7ebf2"}
			borderRadius={"5px"}
			fontSize={"12px"}
			fontWeight={"normal"}
			mt={type === "mobile" ? "0px" : "24px"}
			mb={"21px"}
			justifyContent={"space-between"}
			cursor={"pointer"}
		>
			<Flex
				w={"50%"}
				textAlign={"center"}
				borderRadius={"5px"}
				color={tab === "staking" ? "#fff" : ""}
				bg={tab === "staking" ? "#2a72e5" : "#fff"}
				justifyContent={"center"}
				alignItems={"center"}
				onClick={() => setTab("staking")}
			>
				Staking
			</Flex>
			<Flex
				w={"50%"}
				textAlign={"center"}
				borderRadius={"5px"}
				color={tab === "l2" ? "#fff" : ""}
				bg={tab === "l2" ? "#2a72e5" : "#fff"}
				justifyContent={"center"}
				alignItems={"center"}
				onClick={() => setTab("l2")}
			>
				L2 Info
			</Flex>
		</Flex>
	);
};
