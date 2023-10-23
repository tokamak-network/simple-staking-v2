import { getEventName } from "@/components/getEventName";
import { convertNumber } from "@/components/number";
import trimAddress from "@/components/trimAddress";
import { chakra, Flex, Link, Text } from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { getColumnWidthStaking } from '@/utils/getColumnWidth';
import { useTheme } from '@chakra-ui/react';

type HistoryTableRowProps = {
  key: number
  cell: any
  tableType: string
}

export const HistoryTableRow: FC<HistoryTableRowProps> = ({
  key,
  cell,
  tableType,
  
}) => {
  const {
    id,
    timestamp,
    data,
    eventName,
    sender,
    amount
  
  } = cell.row?.original;
  console.log(cell.row?.original)
  
  const theme = useTheme()
  const type = cell.column.id;
  const typeName = getEventName(eventName)
  return  (
    <chakra.td
      key={key}
      w={ getColumnWidthStaking(tableType, type) }
      {...theme.STAKING_HISTORY_TABLE_STYLE.tableRow()}
      {...cell.getCellProps()}
    >
      {tableType === 'Staking' && type === 'account' ? (
        <Link
          isExternal
          href={`https://etherscan.io/address/${sender}`}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: sender,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {type === 'txHash' ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${id}`}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: id,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {tableType === 'Staking' && type === 'txType' ? (
        //@ts-ignore
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {eventName}
        </Text>
      ) : ('')}
      {tableType === 'Staking' && type === 'amount' ? (
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {convertNumber({
            amount: amount,
            type: 'ray',
            localeString: true,
          })} TON
        </Text>
      ) : ('')}
      {type === 'date' ? (
        <Flex color={'#828d99'}>
          {moment.unix(timestamp).format('YYYY.MM.DD HH:mm:ss (Z)')}
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default HistoryTableRow