import { getEventName } from '@/components/getEventName';
import { convertNumber } from '@/components/number';
import trimAddress from '@/components/trimAddress';
import { chakra, Link, Text, Flex } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useTheme } from '@chakra-ui/react';
import { getLayerName } from '../../../utils/getOldLayerAddress';
import moment from 'moment';
import { getCountdown } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { calcCountDown } from '../../../utils/number';

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

  const { library } = useWeb3React()
  const [ remainTime, setRemainTime ] = useState('')
  
  useEffect(() => {
    async function fetch () {
      if (typeName === 'Unstake') {
        const withdrawableBlock = Number(blockNo) + 93046
        const currentBlock = await library.getBlockNumber()
        if (currentBlock > withdrawableBlock) {
          setRemainTime('0')
        } else {
          const apiValue = await getCountdown(withdrawableBlock)
          setRemainTime(apiValue.EstimateTimeInSec)
        }
      }
    }
    fetch()
  }, [])

  // console.log(remainTime)
  

  const withdrawableTime = (blockNumber: number) => {
    const withdrawableBlock = Number(blockNumber) + 93046
    return (
      <Flex justifyContent={'center'}>
        <Flex mr={'3px'}>
          Withdrawable at block
        </Flex>
        <Link
          isExternal
          href={`https://etherscan.io/block/countdown/${withdrawableBlock}`}
          color={'#2a72e5'}
        >
          {withdrawableBlock}
        </Link>
        <Flex ml={'3px'}>
          {calcCountDown(remainTime)}
        </Flex>
      </Flex>
    )
  }

  return  (
    <chakra.td
      key={index}
      w={ 
        type === 'index' ? '70px' :
        type === 'txHash' || type === 'contractAddress' ? '140px' :
        type === 'txType' || type === 'amount' ? '130px' :
        type === 'blockNumber' ? '360px' :
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
          {typeName === 'Unstake' ? withdrawableTime(blockNo) : moment.unix(txTime).format('YYYY.MM.DD HH:mm:ss (Z)')}
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
