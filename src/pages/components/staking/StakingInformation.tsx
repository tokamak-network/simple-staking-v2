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
      w="100%"
      m={0}
      justifyContent={'space-between'}
      alignItems="start"
      // pt="70px"
      border={'none'}
      flexDir={'column'}
    >
      <Flex>
      <Box p={0} w={'390px'} borderRadius={'10px'} alignSelf={'flex-start'}>
          <WalletInformation 
            data={data}
          />
        </Box>
        <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
          <Flex flexDir={'column'} alignItems={'space-between'}>
            <OperatorDetailInfo 
              title={'Total Stakers'}
              value={data?.stakedUserList.length}
            />
          </Flex>
          <Flex flexDir={'column'} alignItems={'space-between'} mt={'40px'}>
            <OperatorDetailInfo 
              title={'Pending Withdrawal'}
              value={pendingUnstaked}
              unit={'TON'}
              type={''}
            />
          </Flex>
        </Flex>
        

        <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
          <Flex flexDir={'column'} alignItems={'space-between'}>
            <OperatorDetailInfo 
              title={'Your Staked'}
              value={yourStake}
              unit={'TON'}
              type={''}
            />
          </Flex>
          <Flex flexDir={'column'} alignItems={'space-between'} mt={'40px'}>
            <OperatorDetailInfo 
              title={'Unclaimed Staking Reward'}
              value={userExpectedSeig}
              unit={'TON'}
              type={''}
              contractInfo={data?.candidateContract}
              candidate={data?.candidate}
              minimumAmount={minimumAmount}
            />
          </Flex>
        </Flex>
      </Flex>
      {/* table area */}
      <Flex 
        flexDir={'row'} 
        mt={'60px'} 
        ml={'70px'} 
        justifyContent={'center'} 
        alignItems={'center'}
      >
        {
          filteredTxHistory &&
          <HistoryTable 
            columns={historyColumns}
            data={filteredTxHistory}
            tableType={'Staking'}
          />
        }
        {
          commitHistory &&
          <HistoryTable 
            columns={historyColumns}
            data={commitHistory}
            tableType={'Commit'}
          />
        }
      </Flex>
    </Flex>
  )
} 

export default StakingInformation