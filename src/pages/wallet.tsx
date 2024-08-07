import { Box, Flex, useTheme } from '@chakra-ui/react';
import PageHeader from './components/layout/PageHeader';
import TopCardContainer from './components/wallet/TopCardContainer';
import GraphContainer from './components/wallet/GraphContainer';
import { MyHistoryTable } from '../common/table/wallet/MyHistoryTable';
import { useMemo, useState } from 'react';
import { useUserHistory } from '../hooks/wallet/useUserHIstory';
// import { useAccumulatedReward } from '@/hooks/wallet/useAccumulatedReward';
import { convertNumber } from '../utils/number';
import { useTopCardInfo } from '@/hooks/wallet/useTopCardInfo';

function Wallet () {
  const theme = useTheme();
  const { userHistory } = useUserHistory();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  // const { accumulatedReward } = useAccumulatedReward()
  // const { userTotalStaked } = useOperatorList()
  const { userTotalStaked, userPendingWithdrawal } = useTopCardInfo()

  const myTotalStaked = userTotalStaked ? convertNumber({
    amount: userTotalStaked,
    type: 'ray',
    localeString: true
  }) : '0.00' 

  const myPendingWithdrawal = userPendingWithdrawal ? convertNumber({
    amount: userPendingWithdrawal,
    type: 'ray',
    localeString: true
  }) : '0.00' 

  
  const historyColumns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
      },
      {
        Header: 'Transaction Hash',
        accessor: 'txHash',
      },
      {
        Header: 'Operator Contract',
        accessor: 'contractAddress',
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
        Header: 'Time',
        accessor: 'blockNumber',
      },
    ],
    [],
  );

  return (
    <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
      <PageHeader title={'Account'} subtitle={'Check the status of your assets in the account'}/>
      <Box fontFamily={theme.fonts.roboto}>
        <TopCardContainer
          totalStaked={myTotalStaked}
          pendingWithdrawal={myPendingWithdrawal}
          accumulatedReward={''}
        />
        {/* <GraphContainer /> */}
        <MyHistoryTable 
          columns={historyColumns}
          data={userHistory}
          isLoading={tableLoading}
        />
      </Box>
    </Flex>
  );
}

export default Wallet;