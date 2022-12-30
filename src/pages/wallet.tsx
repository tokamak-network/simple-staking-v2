import { Box, Flex, Text, useMediaQuery, useColorMode, useTheme } from '@chakra-ui/react';
import PageHeader from "./components/layout/PageHeader";
import TopCardContainer from './components/wallet/TopCardContainer';
import GraphContainer from './components/wallet/GraphContainer';
import { MyHistoryTable } from './components/wallet/MyHistoryTable';
import { useMemo, useState } from 'react';
import { useUserHistory } from '../hooks/wallet/useUserHIstory';

function Wallet () {
  const theme = useTheme()
  const { userHistory } = useUserHistory()
  const [tableLoading, setTableLoading] = useState<boolean>(true);

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
        <TopCardContainer />
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