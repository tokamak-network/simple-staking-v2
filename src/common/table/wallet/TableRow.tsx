import { getEventName } from '@/components/getEventName';
import { convertNumber } from '@/components/number';
import trimAddress from '@/components/trimAddress';
import { chakra, Link, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useTheme } from '@chakra-ui/react';
import { getLayerName } from '../../../utils/getOldLayerAddress';

type TableRowProps = {
  index: number
  cell: any
}

export const TableRow: FC<TableRowProps> = ({
  index,
  cell,
}) => {
  // console.log(cell?.row.original)
  const {
    transactionHash,
    layer2,
    sender,
    transaction,
    timestamp,
    blockTimestamp,
    amount,
    data,
    eventName,
    from,
    blockNumber,
    candidate,
  } = cell?.row.original;
  
  const txSender = sender ? sender : from
  const txId = transaction ? transaction.id : transactionHash
  const txTime = timestamp ? timestamp : blockTimestamp
  const values = amount ? amount : data?.amount
  const candidateId = candidate ? candidate.id : layer2
  const blockNo = transaction ? transaction.blockNumber : blockNumber

  const theme = useTheme()
  const type = cell.column.id;
  const typeName = getEventName(eventName)
  const layerName = getLayerName(candidateId)

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
      {txId && type === 'txHash' ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${txId}`}
          textAlign={'center'}
          w={'100%'}
          color={'#2a72e5'}
        >
          {trimAddress({
            address: txId,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })}
        </Link>
      ) : ('')}
      {type === 'contractAddress' ? (
        <Link
          isExternal
          href={`https://etherscan.io/address/${txSender}`}
          textAlign={'center'}
          w={'100%'}
          color={'#2a72e5'}
        >
          {layerName}
          {/* {trimAddress({
            address: candidateId,
            firstChar: 6,
            lastChar: 4,
            dots: '...'
          })} */}
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
            amount: values,
            type: 'ray',
            localeString: true,
          })} TON
        </Text>
      ) : ('')}
      {type === 'blockNumber' ? (
        //@ts-ignore
        <Text textAlign={'center'} color={'#304156'} w={'100%'}>
          {blockNo}
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
