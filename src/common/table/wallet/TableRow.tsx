import { getEventName } from '@/components/getEventName';
import { convertNumber } from '@/components/number';
import trimAddress from '@/components/trimAddress';
import { chakra, Link, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useTheme } from '@chakra-ui/react';

type TableRowProps = {
  index: number
  cell: any
}

export const TableRow: FC<TableRowProps> = ({
  index,
  cell,
}) => {
  const {
    transactionHash,
    layer2,
    data,
    eventName,
    from,
    blockNumber
  } = cell?.row.original;

  const theme = useTheme()
  const type = cell.column.id;
  const typeName = getEventName(eventName)

  return  (
    <chakra.td
      key={index}
      w={ 
        type === 'index' ? '70px' :
        type === 'txHash' || type === 'contractAddress' ? '200px' :
        type === 'txType' || type === 'amount' ? '160px' :
        type === 'blockNumber' ? '180px' :
        type === 'status' ? '140px' : ''
      }
      {...theme.STAKING_HISTORY_TABLE_STYLE.tableRow()}
      {...cell.getCellProps()}
    >
      {type === 'index' ? (
        <Text color={'#304156'} textAlign={'center'} w={'100%'}>
          {index}
        </Text>
      ) : ('')}
      {transactionHash && type === 'txHash' ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${transactionHash}`}
          textAlign={'center'}
          w={'100%'}
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
      {type === 'contractAddress' ? (
        <Link
          isExternal
          href={`https://etherscan.io/address/${from}`}
          textAlign={'center'}
          w={'100%'}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: layer2,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {type === 'txType' ? (
        //@ts-ignore
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {typeName}
        </Text>
      ) : ('')}
      {type === 'amount' ? (
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {convertNumber({
            amount: data.amount,
            type: 'ray',
            localeString: true,
          })} TON
        </Text>
      ) : ('')}
      {type === 'blockNumber' ? (
        //@ts-ignore
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {blockNumber}
        </Text>
      ) : ('')}
      {type === 'status' ? (
        <Text color={'#304156'} textAlign={'center'} w={'100%'}>
          True
        </Text>
      ) : ('')}
    </chakra.td>
  )
}

export default TableRow
