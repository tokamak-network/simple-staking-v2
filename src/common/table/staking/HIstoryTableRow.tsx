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
  currentPage: any
}

export const HistoryTableRow: FC<HistoryTableRowProps> = ({
  key,
  
  cell,
  tableType,
  currentPage
}) => {
  const {
    id,
    timestamp,
    data,
    eventName,
    sender,
    amount,
    transaction,
    layer2,
    value,
    transactionHash,
    blockTimestamp,
    from
  } = cell.row?.original;

  const txSender = sender ? sender : from
  const txId = transaction ? transaction.id : transactionHash
  const txTime = timestamp ? timestamp : blockTimestamp
  const values = amount ? amount : data?.amount
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
      {tableType === 'Transactions' && type === 'account' ? (
        <Link
          isExternal
          href={`https://etherscan.io/address/${txSender}`}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: txSender,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {tableType === 'Update Seigniorage' && type === 'txHash' ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${txId}`}
          color={'#2a72e5'}
        >
          {(key + 1)}
        </Link>
      ) : ('')}
      {type === 'Update #' ? (
        //@ts-ignore
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {(key + 1)}
        </Text>
      ) : ('')}
      {tableType === 'Transactions' && type === 'txType' ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${txId}`}
          color={'#2a72e5'}
        >
          {typeName}
        </Link>
      ) : ('')}
      {tableType === 'Transactions' && type === 'amount' ? (
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {convertNumber({
            amount: values,
            type: 'ray',
            localeString: true,
          })} TON
        </Text>
      ) : ('')}
      {type === 'date' ? (
        <Flex color={'#828d99'}>
          {moment.unix(txTime).format('YYYY.MM.DD HH:mm:ss (Z)')}
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default HistoryTableRow