import { getEventName } from "@/components/getEventName";
import { convertNumber } from "@/components/number";
import trimAddress from "@/components/trimAddress";
import { chakra, Flex, Link, Text } from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { getColumnWidthStaking } from '@/utils/getColumnWidth';
import { useTheme } from '@chakra-ui/react';

type HistoryTableRowProps = {
  index: number
  cell: any
  tableType: string
}

export const HistoryTableRow: FC<HistoryTableRowProps> = ({
  index,
  cell,
  tableType,
  
}) => {
  const {
    transactionHash,
    blockTimestamp,
    data,
    eventName,
    from
  } = cell.row.original;

  const theme = useTheme()
  const type = cell.column.id;
  const typeName = getEventName(eventName)
  return  (
    <chakra.td
      key={index}
      w={ getColumnWidthStaking(tableType, type) }
      {...theme.STAKING_HISTORY_TABLE_STYLE.tableRow()}
      {...cell.getCellProps()}
    >
      {tableType === 'Staking' && type === 'account' ? (
        <Link
          isExternal
          href={`https://etherscan.io/address/${from}`}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: from,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {type === 'txHash' ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${transactionHash}`}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: transactionHash,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {tableType === 'Staking' && type === 'txType' ? (
        //@ts-ignore
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {typeName}
        </Text>
      ) : ('')}
      {tableType === 'Staking' && type === 'amount' ? (
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {convertNumber({
            amount: data.amount,
            type: 'ray',
            localeString: true,
          })} TON
        </Text>
      ) : ('')}
      {type === 'date' ? (
        <Flex color={'#828d99'}>
          {moment.unix(blockTimestamp).format('YYYY.MM.DD HH:mm:ss (Z)')}
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default HistoryTableRow