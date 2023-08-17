import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {
  chakra,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Select,
  Box,
  useColorMode,
  Center,
  useTheme,
  Image,
  Button,
} from '@chakra-ui/react';
import { FC, useCallback, useState, useMemo } from 'react';
import HistoryTable from '../staking/HistoryTable';
import OperatorDetailInfo from '../staking/OperatorDetail';
import WalletInformation from '@/pages/components/staking/WalletInformation';
import moment from "moment";

type SequencerTableProps = {
  columns: Column[];
  data?: any[];
  isLoading: boolean;
};

export const SequencerTable: FC<SequencerTableProps> = ({
  
  
}) => {
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

  const renderRowSubComponent = useCallback(
    ({row}: any) => {
    const { layer2, delegators, commit, operatorsHistory, pendingWithdrawal } = row.original;
    const lastFinalized = commit.length !== 0 ? commit[0].blockTimestamp : '0'
    const recentCommit = lastFinalized !== '0' ? moment.unix(lastFinalized).format('YYYY.MM.DD HH:mm:ss (Z)') : 'The operator does not have any commits';
    return (
      <Flex
        w="100%"
        m={0}
        justifyContent={'space-between'}
        alignItems="start"
        pt="70px"
        border={'none'}
        flexDir={'column'}
      >
        <Flex>
          <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <OperatorDetailInfo 
                title={'Total Delegator'}
                value={delegators}
              />
            </Flex>
            <Flex flexDir={'column'} alignItems={'space-between'} mt={'40px'}>
              <OperatorDetailInfo 
                title={'Pending Withdrawal'}
                value={pendingWithdrawal}
                unit={'TON'}
                type={''}
              />
            </Flex>
          </Flex>
          <Box p={0} w={'390px'} borderRadius={'10px'} alignSelf={'flex-start'}>
            <WalletInformation 
              data={row.original}
            />
          </Box>

          <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <OperatorDetailInfo 
                title={'Recent Commit'}
                value={recentCommit}
                type={'date'}
              />
            </Flex>
            <Flex flexDir={'column'} alignItems={'space-between'} mt={'40px'}>
              <OperatorDetailInfo 
                title={'Commit Count'}
                value={commit.length}
              />
            </Flex>
          </Flex>
        </Flex>
        {/* table area */}
        <Flex flexDir={'row'} mt={'60px'} ml={'70px'} justifyContent={'center'} alignItems={'center'}>
          <HistoryTable 
            columns={historyColumns}
            data={operatorsHistory}
            tableType={'Staking'}
          />
          <HistoryTable 
            columns={historyColumns}
            data={commit}
            tableType={'Commit'}
          />
        </Flex>
      </Flex>
    )
  }, [historyColumns]);
  
  return (
    <Flex></Flex>
  )
}