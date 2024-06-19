import { getEventName } from "@/components/getEventName";
import { convertNumber } from "@/components/number";
import trimAddress from "@/components/trimAddress";
import { chakra, Checkbox, Flex, Link, Text } from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { getColumnWidthStaking } from '@/utils/getColumnWidth';
import { useTheme } from '@chakra-ui/react';
import { getColumnWidthWithdraw } from '../../../../../utils/getColumnWidth';

type WithdrawTableRowProps = {
  // key: number
  index: number
  cell: any
}

export const WithdrawTableRow: FC<WithdrawTableRowProps> = ({
  // key,
  index,
  cell,
}) => {
  const {
    data,
    amount,
    withdrawableBlockNumber,
  } = cell.row?.original;

  const values = amount ? amount : data?.amount
  const theme = useTheme()
  const type = cell.column.id;

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
        <Flex 
          justifyContent={'center'}
          alignItems={"center"}
        >
          <Checkbox 
            bgColor={'#e9edf1'} 
            borderRadius={'4px'} 
            border={'solid 1px #e7ebf2'} 
            w={'18px'}
            h={'18px'}
          />
        </Flex>
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
          {withdrawableBlockNumber.toString()}
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default WithdrawTableRow