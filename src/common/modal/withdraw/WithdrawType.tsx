import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { Button, Flex, Image } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { TokenSelector } from "@/common/menulist/TokenSelector";
import NoLOGO from "@/assets/images/modal/gallery.svg";

type WithdrawTypeProps = {
	name: string;
	content: string;
	onClick?: any;
	src?: string;
};

export const WithdrawType = (args: WithdrawTypeProps) => {
	const { name, content, onClick, src } = args;

	const [width] = useWindowDimensions();
	const mobile = width && width < 1040;
	const options = ["WTON", "TON"];

	const [option, setOption] = useState("WTON");

	const [menuState, setMenuState] = useState(false);
	useEffect(() => {
		setMenuState(false);
	}, []);

	const handleSetOption = useCallback((option: any) => {
		setOption(option);
		setMenuState(false);
	}, []);

	return (
		<Flex
			w={mobile ? "100%" : "300px"}
			h={mobile ? "140px" : "253px"}
			flexDir={mobile ? "row-reverse" : "column"}
			justifyContent={"center"}
			alignItems={"center"}
			borderRadius={"15px"}
			cursor={"pointer"}
			bgColor={"#fff"}
			boxShadow={"0 2px 6px 0 rgba(61, 73, 93, 0.1)"}
			textAlign={"center"}
			_hover={{
				border: "solid 1px rbga(31, 142, 250, 0.5)",
				boxShadow: "0 2px 6px 0 rgba(31, 142, 250, 0.25)",
			}}
			mb={mobile ? "12px" : "0px"}
			onClick={() => onClick()}
		>
			<Flex
				flexDir={"column"}
				textAlign={mobile ? "left" : "center"}
				justifyContent={"center"}
			>
				<Flex
					fontSize={mobile ? "17px" : "18px"}
					fontWeight={"bold"}
					color={"#3d495c"}
					flexDir={"column"}
				>
					{name}
				</Flex>
				<Flex
					mt={"12px"}
					mb={mobile ? "0px" : "25px"}
					fontSize={mobile ? "11px" : "12px"}
					color={"#86929d"}
					flexDir={"column"}
					w={mobile ? "230px" : "280px"}
				>
					{content}
				</Flex>
			</Flex>
			{src ? (
				<Flex
					w={mobile ? "60px" : "96px"}
					h={mobile ? "60px" : "96px"}
					mr={mobile ? "12px" : ""}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<Image src={src} alt={""} />
				</Flex>
			) : name === "Prior to Patch" ? (
				<Flex flexDir={"column"} alignItems={"center"}>
					<Flex fontSize={"12px"} fontWeight={500} color={"#808992"} mb={"9px"}>
						Withdrawable Balance
					</Flex>
					<Flex h={"24px"} flexDir={"row"}>
						<Flex
							mr={"9px"}
							color={"#3d495c"}
							fontSize={"18px"}
							fontWeight={500}
						>
							{"20,000.00"}
						</Flex>
						<TokenSelector
							option={option}
							setOption={handleSetOption}
							menuState={menuState}
							setMenuState={setMenuState}
							options={options}
						/>
					</Flex>
					<Flex>
						<Button
							w={"130px"}
							h={"38px"}
							borderRadius={"4px"}
							bgColor={"#257eee"}
							color={"#fff"}
							fontSize={"14px"}
							fontWeight={500}
							mt={"25px"}
						>
							Withdraw
						</Button>
					</Flex>
				</Flex>
			) : (
				""
			)}
		</Flex>
	);
};
