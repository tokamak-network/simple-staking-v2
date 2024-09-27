import { convertNumber } from "@/components/number";
import { chakra, Flex, Text, useCheckbox } from "@chakra-ui/react";
import { FC } from "react";
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';
import TICK from '@/assets/images/Tick.svg'
import Image from "next/image";
import { findMax } from "@/components/array";

type WithdrawTableRowProps = {
  // key: number
  index: number
  cell: any
  tonPrice: number
}

export const WithdrawTableRow: FC<WithdrawTableRowProps> = ({
  // key,
  index,
  cell,
  
  tonPrice
}) => {
  const {
    data,
    amount,
    time,
  } = cell.row?.original;

  const values = amount ? amount : data?.amount
  
  const type = cell.column.id;
  const usdValue =  ((tonPrice * +values) / Math.pow(10, 27)).toLocaleString(undefined, {maximumFractionDigits: 3})

  return  (
    <chakra.td
      key={index}
      w={ getColumnWidthWithdraw(type) }
      // {...theme.STAKING_Withdraw_TABLE_STYLE.tableRow()}
      {...cell.getCellProps()}
      fontSize={'12px'}
      justifyContent={'space-between'}
      alignItems={"center"}
      h={'30px'}
    >
      { type === 'amount' ? (
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Text textAlign={'center'} color={time === 'Withdrawable' ? '#000000' : '#828d99'} >
            {convertNumber({
              amount: values,
              type: 'ray',
              localeString: true,
            })} TON
          </Text>
          <Text color={'#646d7c'} ml={'0px'}>
            {`($${usdValue})`}
          </Text>
        </Flex>
      ) : ('')}
      {type === 'status' ? (
        <Flex 
          color={time === 'Withdrawable' ? '#828d99' : '#000000'}
          justifyContent={'center'}
          alignItems={"center"}
        >
          {time}
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default WithdrawTableRow