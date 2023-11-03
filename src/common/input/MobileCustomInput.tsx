import {
  InputGroup,
  useColorMode,
  NumberInput,
  Text,
  NumberInputField,
  Button,
  Flex,
  useTheme,
} from "@chakra-ui/react";
import { inputState } from "@/atom/global/input";
import React, { useEffect, useState, SetStateAction } from "react";
import { useRecoilState } from "recoil";
import { floatParser } from "@/components/number";
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
  } = props;
  const [value, setValue] = useRecoilState(inputState);
  const theme = useTheme();
  const { INPUT_STYLE } = theme;
  const [error, setError] = useState(false);

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

  return (
    <InputGroup h="40px" justifyContent={"space-between"}>
      <Flex
        w={!maxButton? '100%': "90%"}
        border={error ? "solid 1px red" : "solid 1px #dfe4ee"}
        borderRadius="4px"
        h="40px"
        justifyContent={"flex-end"}
        alignItems="center"
        px="10px"
        mr={'15px'}
        fontSize={"13px"}
      >
        {txt ? <Text>Amount</Text> : <></>}

        <NumberInput
          w={w}
          h={h || "40px"}
          focusBorderColor={"transparent"}
          border={type === "staking" ? "none" : "1px solid #dfe4ee"}
          borderRadius={"4px"}
          value={addComma(value)}
          px="0px"
        >
          <Flex
            flexDir={type === "staking" ? "row" : "row"}
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
            <Text fontSize={"13px"} fontWeight={"normal"} ml={"7px"} mt={"1px"}>
              TON
            </Text>
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
    </InputGroup>
  );
}

export default MobileCustomInput;
