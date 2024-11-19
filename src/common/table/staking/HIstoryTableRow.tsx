import { getEventName } from "@/components/getEventName";
import { calcCountDown, convertNumber } from "@/components/number";
import trimAddress from "@/components/trimAddress";
import { Button, chakra, Flex, Link, Text } from "@chakra-ui/react";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import { getColumnWidthStaking } from '@/utils/getColumnWidth';
import { useTheme } from '@chakra-ui/react';
import { ETHERSCAN_API, ETHERSCAN_LINK } from "@/constants";
import { fromNow } from "@/components/getDate";
import { getCountdown } from "@/api";
import { useWeb3React } from "@web3-react/core";
import { useRecoilState } from "recoil";
import { modalData, modalState } from "@/atom/global/modal";
import { ModalType } from "@/types/modal";

type HistoryTableRowProps = {
  key: number
  
  cell: any
  tableType: string
  currentPage: any
  selectedModalData: any
}

export const HistoryTableRow: FC<HistoryTableRowProps> = ({
  key,
  
  cell,
  tableType,
  currentPage,
  selectedModalData
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
    from,
    index,
    withdrawable,
    withdrawn
  } = cell.row?.original;

  const txSender = sender ? sender : from
  const txId = transaction ? transaction.id : transactionHash
  const txTime = timestamp ? timestamp : blockTimestamp
  const values = amount ? amount : data?.amount
  const theme = useTheme()
  const type = cell.column.id;
  
  const typeName = getEventName(eventName)
  const { library, account } = useWeb3React()

  const [ remainTime, setRemainTime ] = useState('')
  const [, setSelectedModalData] = useRecoilState(modalData);
  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [ block, setBlock ] = useState(0)

  const delay = 93046
  const blockNo = transaction.blockNumber

  const modalButton = useCallback(async (modalType: ModalType, data: any) => {
    setSelectedModal(modalType);
    setSelectedModalData(data);
  }, []);
  
  
  useEffect(() => {
    async function fetch () {
      if (typeName === 'Unstake' && delay) {

        const withdrawableBlock = Number(blockNo) + delay
        const currentBlock = await library.getBlockNumber()

        setBlock(currentBlock)

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

  const withdrawableTime = (blockNumber: number) => {
    const withdrawableBlock = Number(blockNumber) + 93046
    
    return (
      <Flex>
        {
          withdrawable ? (
            <Flex>
              <Button 
                w={'80px'}
                h={'25px'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'4px'}
                border={'1px solid #2a72e5'}
                bgColor={'#fff'}
                color={'#2a72e5'}
                fontSize={'12px'}
                fontWeight={400}
                onClick={()=>modalButton('withdraw', selectedModalData)}
              > 
                Withdraw 
              </Button>
            </Flex>
          ) : (
            <Flex justifyContent={'center'} flexDir={'column'}>
              <Flex flexDir={'row'}>
                <Flex mr={'3px'} color={'#304156'}>
                  Withdrawable at block
                </Flex>
                <Link
                  isExternal
                  href={`${ETHERSCAN_LINK}/block/countdown/${withdrawableBlock}`}
                  color={'#2a72e5'}
                >
                  {withdrawableBlock}
                </Link>
              </Flex>
              <Flex ml={'3px'} color={'#828d99'}>
                {calcCountDown(remainTime)}
              </Flex>
            </Flex>
          )
        }
      </Flex>
    )
  }
  
  return  (
    <chakra.td
      key={key}
      w={ getColumnWidthStaking(tableType, type) }
      {...theme.STAKING_HISTORY_TABLE_STYLE.tableRow()}
      {...cell.getCellProps()}
      justifyContent={ 
        ((type === 'date' && tableType) || 
          (tableType === 'Transactions' && type === 'account')) 
          == 'Update Seigniorage' ? 'start' : 'center'}
    >
      {tableType === 'Transactions' && type === 'account' ? (
        <Link
          isExternal
          href={`${ETHERSCAN_LINK}/address/${txSender}`}
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
          href={`${ETHERSCAN_LINK}/tx/${txId}`}
          color={'#2a72e5'}
          alignItems={'center'}
          
        >
          {index}
        </Link>
      ) : ('')}
      {tableType === 'Transactions' && type === 'txType' ? (
        <Link
          isExternal
          href={`${ETHERSCAN_LINK}/tx/${txId}`}
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
      {type === 'date' && tableType == 'Update Seigniorage' ? (
        <Flex color={'#828d99'}>
          {fromNow(txTime)}
      </Flex>
      ) : ''}
      {type === 'date' && tableType === 'Transactions' ? (
        <Flex color={'#828d99'}>
          {
            typeName === 'Unstake' 
            && account?.toLowerCase() === sender.toLowerCase() 
              ? withdrawn ? moment.unix(txTime).format('YYYY.MM.DD HH:mm:ss (Z)') : withdrawableTime(blockNo) 
                : moment.unix(txTime).format('YYYY.MM.DD HH:mm:ss (Z)')
          }
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default HistoryTableRow