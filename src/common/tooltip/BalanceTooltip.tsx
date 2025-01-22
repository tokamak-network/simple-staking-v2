import { convertNumber } from "@/components/number";
import { RAY } from "@/constants";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import {
  Tooltip,
  useColorMode,
  PlacementWithLogical,
  Text,
  Flex,
  Link
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useState } from "react";
import BasicTooltip from ".";
import { useTONPrice } from '../../hooks/staking/useTONPrice';
import {  floatParser } from "@/components/number"

type BalanceTooltipProps = {
  label: string | undefined;
  placement?: PlacementWithLogical;
  label2?: string | undefined
  types?: 'ray' | 'wei' 
  size?: string
}

export const BalanceTooltip = (args: BalanceTooltipProps) => {
  const { label, label2, placement, types, size } = args;

  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const { tonPriceUSD } = useTONPrice()

  const [ width ] = useWindowDimensions();
  const mobile = width && width < 1040;
  const wei = 1e18
  const ray = 1e27
  

  const convertedNumber = label ? convertNumber({
    amount: label , 
    type: types,
    localeString: true
  }) : '0.00'

  
  const labelDiv = (Number(label) / (types === 'ray' ? ray : wei)).toLocaleString(undefined, {maximumFractionDigits: 18});
  const usdValue = label ? ((+label * tonPriceUSD) / Math.pow(10, types === 'ray' ? 27 : 18)).toLocaleString(undefined, {maximumFractionDigits: 3}) : '0.00';

  return (
    <Flex 
      flexDir={mobile ? 'row' : 'row'}
      justifyContent={mobile ? 'space-between' : 'center'}
      // alignItems={'center'}
    >
      <Tooltip
        display={label?.length === 0 ? "none" : "flex"}
        placement={placement ?? "top"}
        pointerEvents={"all"}
        label={
          `${labelDiv}  |  $${usdValue}`
        }
        borderRadius={"3px"}
        color={'#fff'}
        fontSize="12px"
        maxW={'270px'}
        px={'10px'}
        py={'6px'}
        bgColor={'#353c48'}
        boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}
        hasArrow
        isOpen={isLabelOpen}
        border={'0px'}
      >
        <Flex
          onMouseLeave={() => setIsLabelOpen(false)}
          onMouseEnter={() =>  setIsLabelOpen(true)}
          cursor={'pointer'}
        >
          {convertedNumber}
        </Flex>
      </Tooltip>
    </Flex>
  )
}