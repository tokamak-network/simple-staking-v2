import { Box, Flex, Text, useMediaQuery, useColorMode, useTheme } from '@chakra-ui/react';
import PageHeader from "./components/layout/PageHeader";
import TopCardContainer from './components/wallet/TopCardContainer';
import GraphContainer from './components/wallet/GraphContainer';
import { MyHistoryTable } from './components/wallet/MyHistoryTable';
import { useMemo, useState } from 'react';
import { useUserHistory } from '../hooks/wallet/useUserHIstory';
import { useAccumulatedReward } from '@/hooks/wallet/useAccumulatedReward';
import { useRecoilValue } from 'recoil';
import { userStakedStatusState } from '@/atom/wallet/totalStaked';
import { convertNumber } from '../utils/number';
import useOperatorList from '../hooks/staking/useOperatorList';

function Wallet () {
  const theme = useTheme()
  const { userHistory } = useUserHistory()
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { accumulatedReward } = useAccumulatedReward()
  const { userTotalStaked } = useOperatorList()
  // const staked = useRecoilValue(userStakedStatusState)
  const myTotalStaked = userTotalStaked ? convertNumber({
    amount: userTotalStaked,
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
        Header: 'Block Number',
        accessor: 'blockNumber',
      },
      {
        Header: 'Status',
        accessor: 'status',
      }
    ],
    [],
  );

  return (
    <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
      <PageHeader title={'Wallet'} subtitle={'Check the status of your assets in the wallet'}/>
      <Box fontFamily={theme.fonts.roboto}>
        <TopCardContainer
          totalStaked={myTotalStaked}
          pendingWithdrawal={''}
          accumulatedReward={accumulatedReward}
        />
        <GraphContainer />
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