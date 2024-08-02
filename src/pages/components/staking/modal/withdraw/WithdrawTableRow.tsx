import { convertNumber } from "@/components/number";
import { Box, chakra, Checkbox, Flex, Link, Text, useCheckbox } from "@chakra-ui/react";
import { FC } from "react";
import { useTheme } from '@chakra-ui/react';
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';
import TICK from '@/assets/images/Tick.svg'
import Image from "next/image";
import { findMax } from "@/components/array";

type WithdrawTableRowProps = {
  // key: number
  index: number
  cell: any
  props: any
  value: any
  toggle: string
  tonPrice: number
}

export const WithdrawTableRow: FC<WithdrawTableRowProps> = ({
  // key,
  index,
  cell,
  props,
  value,
  toggle,
  tonPrice
}) => {
  const {
    data,
    amount,
    time,
  } = cell.row?.original;

  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)
  const values = amount ? amount : data?.amount
  const theme = useTheme()
  const type = cell.column.id;
  const usdValue =  ((tonPrice * +values) / Math.pow(10, 27)).toLocaleString(undefined, {maximumFractionDigits: 3})

  return  (
    <chakra.td
      key={index}
      w={ getColumnWidthWithdraw(type) }
      // {...theme.STAKING_Withdraw_TABLE_STYLE.tableRow()}
      {...cell.getCellProps()}
      fontSize={'12px'}
      justifyContent={'center'}
      alignItems={"center"}
      h={'30px'}
    >
     {
       type === 'checkbox' ? (
        <chakra.label
          display='flex'
          flexDirection='row'
          alignItems='center'
          pl={'10px'}
          cursor='pointer'
          {...htmlProps}
        >
          <input 
            {...getInputProps()} 
            disabled={toggle == 'Withdraw' || findMax(value) > Number(props.value.toString())} 
          />
          <Flex
            alignItems='center'
            justifyContent='center'
            border='1px solid'
            borderRadius={'4px'}
            borderColor='#e7ebf2'
            bgColor={'#e9edf1'}
            w={'18px'}
            h={'18px'}
            {...getCheckboxProps()}
          >
            {state.isChecked && <Image src={TICK} alt={''} />}
          </Flex>
        </chakra.label>
       ) : ('')
     }
      { type === 'amount' ? (
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Text textAlign={'center'} color={'#000000'} >
            {convertNumber({
              amount: values,
              type: 'ray',
              localeString: true,
            })} 
          </Text>
          <Text color={'#646d7c'} ml={'3px'}>
            {`($ ${usdValue})`}
          </Text>
        </Flex>
      ) : ('')}
      {type === 'status' ? (
        <Flex 
          color={'#828d99'}
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