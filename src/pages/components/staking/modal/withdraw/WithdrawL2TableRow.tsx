import { convertNumber } from "@/components/number";
import { Box, chakra, Checkbox, Flex, Link, Text, useCheckbox } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useTheme } from '@chakra-ui/react';
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';

type WithdrawL2TableRowProps = {
  // key: number
  index: number
  cell: any
}

export const WithdrawL2TableRow: FC<WithdrawL2TableRowProps> = ({
  // key,
  index,
  cell,
}) => {
  const {
    amount,
  } = cell.row?.original;

  const values = amount 
  const type = cell.column.id;
  
  return  (
    <chakra.td
      key={index}
      w={'160px'}
      {...cell.getCellProps()}
      fontSize={'12px'}
      justifyContent={'center'}
      alignItems={"center"}
      h={'30px'}
    >
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
            ($0,000)
          </Text>
        </Flex>
      ) : ('')}
      {type === 'status' ? (
        <Flex 
          color={'#828d99'}
          justifyContent={'center'}
          alignItems={"center"}
        >
          {'Withdrawn'}
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default WithdrawL2TableRow