import HistoryTable from "@/common/table/staking/HistoryTable";
import OperatorDetailInfo from "@/common/table/staking/OperatorDetail";
import { getCommitHistory, getTransactionHistory } from "@/components/getTransactionHistory";
import { convertNumber } from "@/components/number";
import { Box, Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import WalletInformation from "./WalletInformation";

type StakingInformationProps = {
  // dispatch: AppDispatch;
  data: any;
};

export const StakingInformation: FC<StakingInformationProps> = ({
  data
}) => {
  const { 
    candidateContract, 
    expectedSeig, 
    candidate, 
    pending, 
    stakeOf, 
    stakedUserList, 
    asCommit,
    stakeOfCandidate
  } = data;
  const txHistory = getTransactionHistory(data)
  const commitHistory = getCommitHistory(data)


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

  const candidateAmount = stakeOfCandidate? convertNumber({
    amount: stakeOfCandidate,
    type: 'ray'
  }) : '0.00'

  const minimumAmount = Number(candidateAmount) >= 1000

  const userExpectedSeig = expectedSeig ? 
    convertNumber({
      amount: expectedSeig,
      type: 'ray',
      localeString: true
    }) : '-' 
  
  const yourStake = convertNumber({
    amount: stakeOf, 
    type: 'ray',
    localeString: true
  })

  const pendingUnstaked = convertNumber({
    amount: pending,
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
        <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
          <Flex flexDir={'column'} alignItems={'space-between'}>
            <OperatorDetailInfo 
              title={'Total Stakers'}
              value={stakedUserList.length}
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
        <Box p={0} w={'390px'} borderRadius={'10px'} alignSelf={'flex-start'}>
          <WalletInformation 
            data={data}
          />
        </Box>

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
              contractInfo={candidateContract}
              candidate={candidate}
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
          txHistory &&
          <HistoryTable 
            columns={historyColumns}
            data={txHistory}
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