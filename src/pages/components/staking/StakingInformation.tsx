import { selectedToggleState, toggleState } from "@/atom/staking/toggle";
import { selectedTypeState, typeFilterState } from "@/atom/staking/txTypeFilter";
import HistoryTable from "@/common/table/staking/HistoryTable";
import OperatorDetailInfo from "@/common/table/staking/OperatorDetail";
import { getCommitHistory, getTransactionHistory } from "@/components/getTransactionHistory";
import { convertNumber } from "@/components/number";
import { useExpectedSeig } from "@/hooks/staking/useCalculateExpectedSeig";
import { Box, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { FC, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import WalletInformation from "./WalletInformation";

type StakingInformationProps = {
  // dispatch: AppDispatch;
  data: any;
};

export const StakingInformation: FC<StakingInformationProps> = ({
  data
}) => {
  const { account } = useWeb3React();
  const txHistory = getTransactionHistory(data)
  const commitHistory = getCommitHistory(data)

  const txTypeValue = useRecoilValue(selectedTypeState)
  const [toggle, setToggle] = useRecoilState(toggleState)
  const [typeFilter, setTypeFilter] = useRecoilState(typeFilterState);
  const [filteredTxHistory, setFilteredTxHistory] = useState(txHistory);
  const [transactionTab, setTransactionTab] = useState(false);

  const historyColumns = useMemo(
    () => [
      {
        Header: 'Account Address',
        accessor: 'account',
      },
      {
        Header: 'TX Hash',
        accessor: 'txHash',
      },
      {
        Header: 'Type',
        accessor: 'txType',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Date',
        accessor: 'date',
      }
    ],
    [],
  );

  useEffect(() => {
    setTypeFilter('All')
  }, [])

  useEffect(() => {
    account ? setToggle('My') : setToggle('All')
  }, [account])
  
  useEffect(() => {
    if (txHistory) {
      const filtered = txTypeValue === 'All' 
        ? txHistory 
        : txHistory.filter((history: any) => {
          return history.eventName === txTypeValue
        })
      const toggleFilter = toggle === 'All' 
        ? filtered
        : filtered.filter((history: any) => {
          return history.sender.toLowerCase() === account?.toLowerCase()
        })
        
      setFilteredTxHistory(toggleFilter)
    }

  }, [txTypeValue, toggle, data?.candidateContract])

  const candidateAmount = data?.stakeOfCandidate ? convertNumber({
    amount: data?.stakeOfCandidate,
    type: 'ray'
  }) : '0.00'

  const minimumAmount = Number(candidateAmount) >= 1000
  
  const expectedSeig = useExpectedSeig(data?.candidateContract, data?.stakedAmount, data?.candidate)
  const userExpectedSeig = expectedSeig ? 
    convertNumber({
      amount: expectedSeig,
      type: 'ray',
      localeString: true
    }) : '-' 
  
  const yourStake = convertNumber({
    amount: data?.stakeOf, 
    type: 'ray',
    localeString: true
  })

  const pendingUnstaked = convertNumber({
    amount: data?.pending,
    type: 'ray',
    localeString: true
  })

  return (
    <Flex
      w="960px"
      m={0}
      justifyContent={'center'}
      alignItems="center"
      // pt="70px"
      border={'none'}
      flexDir={'column'}
      ml={'70px'}
    >
      <Flex alignItems={'center'} justifyContent={'center'} w={'960px'} >
        <Box p={0}  borderRadius={'10px'} alignSelf={'flex-start'}>
          <WalletInformation 
            data={data}
          />
        </Box>
        
          <Flex flexDir={'row'} alignItems={'space-between'} mt={'30px'} ml={'45px'} w={'585px'}>
            <OperatorDetailInfo 
              title={'Staked'}
              value={yourStake}
              totalValue={userExpectedSeig}
              unit={'TON'}
              type={''}
            />
             <OperatorDetailInfo 
              title={'Unclaimed Staking Reward'}
              value={userExpectedSeig}
              totalValue={userExpectedSeig}
              unit={'TON'}
              type={''}
              contractInfo={data?.candidateContract}
              candidate={data?.candidate}
              minimumAmount={minimumAmount}
            />
            <OperatorDetailInfo 
              title={'Pending Withdrawal'}
              value={pendingUnstaked}
              totalValue={userExpectedSeig}
              unit={'TON'}
              type={''}
            />
          </Flex>
        
      
      </Flex>
      <Flex flexDir={'row'} h={'30px'} justifyContent={'center'} alignItems={'center'} my={'30px'}>
        <Flex w={'150px'} h={'1px'} background={'linear-gradient(90deg, rgba(231, 235, 242, 0.00) 0%, #E7EBF2 100%)'}/>
        <Flex 
          borderRadius={'14px'}
          border={'1px solid #e7ebf2'}
          w={'100px'}
          h={'25px'}
          fontSize={'12px'}
          fontWeight={500}
          color={'#304156'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={()=> setTransactionTab(transactionTab ? false : true)}
          cursor={'pointer'}
        >
          {transactionTab ? 'Close' : 'Transactions'}
        </Flex>
        <Flex w={'150px'} h={'1px'} background={'linear-gradient(90deg, #E7EBF2 0%, rgba(231, 235, 242, 0.00) 100%)'}/>
      </Flex>
      {/* table area */}
      {
        transactionTab ?
        <Flex 
          flexDir={'row'} 
          justifyContent={'center'} 
          alignItems={'center'}
        >
          {
            commitHistory &&
            <HistoryTable 
              columns={historyColumns}
              data={commitHistory}
              tableType={'Update Seigniorage'}
            />
          }
          {
            filteredTxHistory &&
            <HistoryTable 
              columns={historyColumns}
              data={filteredTxHistory}
              tableType={'Transactions'}
            />
          }
        </Flex> : ''
      }
    </Flex>
  )
} 

export default StakingInformation