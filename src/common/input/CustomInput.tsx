import {
	InputGroup,
	useColorMode,
	NumberInput,
	Text,
	NumberInputField,
	Button,
	Flex,
	useTheme,
	Input,
} from "@chakra-ui/react";
import { inputState } from "@/atom/global/input";
import React from "react";
import { useRecoilState } from "recoil";
import { floatParser } from "@/components/number";
import useEditL2Info from "@/hooks/staking/useEditL2Info";

type InputProp = {
	placeHolder?: string;
	w?: number | string;
	h?: number | string;
	// isDisabled?: boolean;
	value?: string | number;
	isError?: boolean;
	maxValue?: any;
	type?: string;
	index?: string;
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

function BalanceInput(props: InputProp) {
	const { placeHolder, h, isError, maxValue, type, w } = props;
	const { colorMode } = useColorMode();
	const [value, setValue] = useRecoilState(inputState);
	const theme = useTheme();
	const { INPUT_STYLE } = theme;

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;
		const { value: inputValue } = target;
		setValue(addComma(inputValue));
	};

	return (
		<InputGroup>
			<NumberInput
				isInvalid={isError}
				w={w}
				h={h || 45}
				focusBorderColor={"#fff"}
				border={
					type === "staking" || type === "unstaking"
						? "none"
						: "1px solid #dfe4ee"
				}
				borderRadius={"4px"}
				value={addComma(value)}
				ml={type === "staking" || type === "unstaking" ? "65px" : ""}
			>
				<Flex
					flexDir={type === "staking" ? "column" : "row"}
					alignItems={"center"}
				>
					<NumberInputField
						{...(type === "staking"
							? { ...INPUT_STYLE.inputStaking() }
							: type === "unstaking"
								? { ...INPUT_STYLE.inputUnstaking() }
								: { ...INPUT_STYLE.inputCalc() })}
						w={"200px"}
						ml={type === "unstaking" ? "-60px" : "15px"}
						mr={type === "unstaking" ? "-20px" : ""}
						placeholder={placeHolder}
						onChange={onChange}
					/>
					{type === "staking" ? (
						<Flex
							w={5}
							h={2}
							borderBottom={value === "" ? "solid 2px #2a72e5" : ""}
							animation={"blink"}
						/>
					) : type === "unstaking" ? (
						<Flex border={""}></Flex>
					) : (
						<Text
							fontSize={"13px"}
							fontWeight={"normal"}
							mr={"10px"}
							ml={"7px"}
							mt={"1px"}
						>
							TON
						</Text>
					)}
				</Flex>
			</NumberInput>
			<Button
				zIndex={100}
				{...(type === "staking" || type === "unstaking"
					? { ...INPUT_STYLE.maxStaking() }
					: { ...INPUT_STYLE.maxCalc() })}
				mt={type === "unstaking" ? "0px" : ""}
				onClick={() => {
					setValue(String(maxValue));
				}}
			>
				Max
			</Button>
		</InputGroup>
	);
}

type UrlInputProp = {
	placeHolder?: string;
	w?: number | string;
	h?: number | string;
	// isDisabled?: boolean;
	value?: string | number;
	isError?: boolean;
	type?: string;
	index: string;
	// atomKey: string;
};

function UrlInput(props: UrlInputProp) {
	const { placeHolder, h, isError, index, type, w } = props;
	const { colorMode } = useColorMode();
	const { inputValue, value, setValue } = useEditL2Info(index);
	const theme = useTheme();
	const { INPUT_STYLE } = theme;

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target } = event;
		const { value: inputValue } = target;
		setValue(inputValue);
	};

	return (
		<InputGroup>
			<Input
				isInvalid={isError}
				w={w}
				h={h || 45}
				// focusBorderColor={'#fff'}
				border={
					type === "staking" || type === "unstaking"
						? "none"
						: "1px solid #dfe4ee"
				}
				borderRadius={"4px"}
				value={value}
				onChange={onChange}
				ml={type === "staking" || type === "unstaking" ? "65px" : ""}
			/>
		</InputGroup>
	);
}

export { BalanceInput, UrlInput };
