import {
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import Image from "next/image";
import arrow from "@/assets/images/select-1-arrow-inactive.svg";

type TokenSelectorProps = {
	option: any;
	setOption: any;
	menuState: any;
	setMenuState: any;
	options: any;
};

export const TokenSelector = (args: TokenSelectorProps) => {
	const { option, setOption, menuState, setMenuState, options } = args;
	return (
		<Menu>
			<MenuButton
				maxW={"62px"}
				px={"6px"}
				mx={0}
				h={"24px"}
				color={"#3e495c"}
				fontSize={"12px"}
				bgColor={"#fff"}
				boxShadow={"0 1px 1px 0 rgba(96, 97, 112, 0.14)"}
				borderRadius={"4px"}
				border={"solid 1px #dfe4ee"}
				placeholder="WTON"
				// onChange={onChangeSelectBox}
			>
				<Flex alignItems={"center"} justifyContent={"space-between"}>
					<Text>{option}</Text>
					<Flex
						marginLeft={"4px"}
						height={"24px"}
						transform={menuState === true ? "rotate(180deg)" : ""}
					>
						<Image src={arrow} alt="icon_arrow" />
					</Flex>
				</Flex>
			</MenuButton>
			<MenuList
				// onClick={() => setMenuState(false)}
				color={"#3e495c"}
				bgColor={"#fff"}
				maxW={"100px"}
				width={"100px"}
				boxShadow={"0 2px 4px 0 rgba(96, 97, 112, 0.14)"}
				fontSize={"12px"}
				p={"7px 0px 7px 4px"}
				style={{
					minWidth: "62px",
				}}
			>
				{options.map((option: any, index: number) => {
					return (
						<MenuItem
							mb={"6px"}
							mt={"4px"}
							w={"62px"}
							cursor={"pointer"}
							bg={"none"}
							_hover={{ bg: "none" }}
							onClick={() => setOption(option)}
							key={index}
						>
							{option}
						</MenuItem>
					);
				})}
			</MenuList>
		</Menu>
	);
};
