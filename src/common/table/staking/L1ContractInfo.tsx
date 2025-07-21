import NEWTAB from "@/assets/images/newtab-icon.png";
import trimAddress from "@/components/trimAddress";
import { Flex, Link } from "@chakra-ui/react";
import Image from "next/image";
import { ETHERSCAN_LINK } from "@/constants";
import ETHERSCAN_LINK_Image from "@/assets/images/etherscan_link_icon.png";
import CLOSE from "@/assets/images/popup_close_s_icon.svg";
import { useState } from "react";

type L1ContractInfoType = {
	title: string;
	content: string;
	setIsLabelOpen?: any;
};

export const L1ContractInfo = (props: L1ContractInfoType) => {
	const { title, content, setIsLabelOpen } = props;

	return (
		<Flex
			h={"70px"}
			w={"210px"}
			justifyContent={"start"}
			flexDir={"row"}
			p={"15px"}
			borderBottom={"1px solid #F4F6F8"}
		>
			{content ? (
				<Flex flexDir={"column"}>
					<Flex
						fontSize={"12px"}
						fontWeight={"normal"}
						color={"#86929d"}
						mb={"3px"}
					>
						{title}
					</Flex>
					<Flex justifyContent={"space-between"}>
						<Flex fontSize={"16px"} fontWeight={500} color={"#3d495c"}>
							{trimAddress({
								address: content,
								firstChar: 6,
								lastChar: 4,
								dots: "...",
							})}
						</Flex>
						<Link
							w={"20px"}
							h={"20px"}
							mt={"2px"}
							ml={"6px"}
							cursor={"pointer"}
							href={`${ETHERSCAN_LINK}/address/${content}`}
							isExternal
						>
							<Image src={ETHERSCAN_LINK_Image} alt={""} />
						</Link>
					</Flex>
				</Flex>
			) : (
				""
			)}
			{title === "L2 txn data" ? (
				<Flex
					justifyContent={"start"}
					alignItems={"start"}
					// mt={'15px'}
					cursor={"pointer"}
					onClick={() => setIsLabelOpen(false)}
					position={"absolute"}
					right={"15px"}
					top={"15px"}
				>
					<Image src={CLOSE} alt={""} />
				</Flex>
			) : (
				""
			)}
		</Flex>
	);
};
