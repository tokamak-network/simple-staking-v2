import {
	InputGroup,
	useColorMode,
	NumberInput,
	Text,
	NumberInputField,
	Button,
	Flex,
	useTheme,
	useDisclosure,
} from "@chakra-ui/react";
import { inputState } from "@/atom/global/input";
import React, { useEffect, useState, SetStateAction } from "react";
import { useRecoilState } from "recoil";
import { floatParser } from "@/components/number";
import select1_arrow_inactive from "assets/images/select1_arrow_inactive.png";
import Image from "next/image";
import TokenSelect from "@/pages/components/staking/TokenSelect";

type InputProp = {
	placeHolder?: string;
	w?: number | string;
	h?: number | string;
	// isDisabled?: boolean;
	value?: string | number;
	isError?: boolean;
	maxValue: any;
	type?: string;
	setAmount: React.Dispatch<SetStateAction<any>>;
	maxButton?: boolean;
	txt?: string;
	setTokenType: React.Dispatch<SetStateAction<any>>;
	tokenType: string;
	// atomKey: string;
};

const addComma = (inputVal: any) => {
	const _val = inputVal;
	const checkInputVal = () => {
		if (_val) {
			const floatLen = _val.split(".")[1]?.length;
			if (floatLen) {
				return floatLen > 18 ? _val.slice(0, -1) : _val;
			}
			if (_val.split(".").length > 2) {
				return;
			}
			if (
				_val.split(".")[0]?.length > 1 &&
				_val.split(".")[0]?.substring(0, 1) === "0"
			) {
				return _val.split(".")[0].substring(1);
			}
			if (_val === ".") {
				return _val;
			} else {
				return _val
					.replace(/[^0-9a-zA-Z.]/g, "")
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		}
		return "";
	};

	return checkInputVal();
};

function MobileCustomInput(props: InputProp) {
	const {
		placeHolder,
		h,
		isError,
		maxValue,
		type,
		w,
		setAmount,
		maxButton,
		txt,
		setTokenType,
		tokenType,
	} = props;
	const [value, setValue] = useRecoilState(inputState);
	const theme = useTheme();
	const { INPUT_STYLE } = theme;
	const [error, setError] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;
		const { value: inputValue } = target;
		setValue(addComma(inputValue));
	};

	useEffect(() => {
		const valueWithoutCommas = floatParser(value ? value : "");
		const balanceWithoutComas = floatParser(maxValue ? maxValue : "");
		setError(Number(valueWithoutCommas) > Number(balanceWithoutComas));
		setAmount(valueWithoutCommas);
	}, [value]);

	const tokenList = ["TON", "WTON"];

	return (
		<InputGroup h="40px" justifyContent={"space-between"}>
			<Flex
				w={!maxButton ? "100%" : "90%"}
				border={error ? "solid 1px red" : "solid 1px #dfe4ee"}
				borderRadius="4px"
				h="40px"
				justifyContent={"flex-end"}
				alignItems="center"
				px="10px"
				mr={"15px"}
				fontSize={"13px"}
			>
				{txt ? <Text>Amount</Text> : <></>}

				<NumberInput
					w={w}
					h={h || "40px"}
					focusBorderColor={"transparent"}
					border={
						type === "Stake" || type === "Unstake"
							? "none"
							: "1px solid #dfe4ee"
					}
					borderRadius={"4px"}
					value={addComma(value)}
					px="0px"
				>
					<Flex
						flexDir={type === "Stake" ? "row" : "row"}
						alignItems={"center"}
					>
						<NumberInputField
							textAlign={"right"}
							fontSize={"13px"}
							placeholder={placeHolder}
							border="none"
							_focus={{
								borderWidth: 0,
							}}
							pr="0px"
							_active={{
								borderWidth: 0,
							}}
							onChange={onChange}
						/>
						<Flex alignItems={"center"}>
							<Text ml="7px" fontSize={"13px"} fontWeight="normal">
								{type === "Stake" ? tokenType : "TON"}
							</Text>
							{type === "Stake" ? (
								<Flex height={"9px"} width={"8px"} ml="10px" onClick={onOpen}>
									<Image
										src={select1_arrow_inactive}
										alt={"select1_arrow_inactive"}
									/>
								</Flex>
							) : (
								""
							)}
						</Flex>
					</Flex>
				</NumberInput>
			</Flex>
			{maxButton ? (
				<Button
					bg="transparent"
					border={"solid 1px #2a72e5"}
					fontSize="13px"
					h="40px"
					w="80px"
					color={"blue.200"}
					_focus={{
						bg: "transparent",
					}}
					_active={{
						bg: "transparent",
					}}
					_hover={{
						bg: "transparent",
					}}
					onClick={() => {
						setValue(String(maxValue));
					}}
				>
					MAX
				</Button>
			) : (
				<></>
			)}
			<TokenSelect
				tokenList={tokenList}
				onClose={onClose}
				isOpen={isOpen}
				setSelectedToken={setTokenType}
			/>
		</InputGroup>
	);
}

export default MobileCustomInput;
