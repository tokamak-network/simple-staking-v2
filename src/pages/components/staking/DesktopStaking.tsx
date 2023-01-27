import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";
import useOperatorList from "@/hooks/staking/useOperatorList";
import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useMemo, useCallback, useState } from 'react';
import OperatorDetailInfo from "@/common/table/staking/OperatorDetail";
import PageHeader from "../layout/PageHeader";
import OpearatorTable from "@/common/table/staking/Operators";
import { WalletInformation } from "./WalletInformation";
import HistoryTable from "@/common/table/staking/HistoryTable";
import moment from "moment";

function DesktopStaking () {

    const theme = useTheme();

    const columns = useMemo(
      () => [
        {
          Header: 'name',
          accessor: 'name',
        },
        {
          Header: 'total staked',
          accessor: 'totalStaked',
        },
        {
          Header: 'commision rate',
          accessor: 'commisionRate',
        },
        {
          Header: 'your staked',
          accessor: 'yourStaked',
        },
        {
          // Make an expander cell
          Header: () => null, // No header
          id: 'expander', // It needs an ID
          Cell: ({row}: {row: any}) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? <IconClose /> : <IconOpen />}
            </span>
          ),
        },
      ],
      [],
    );
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
  
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const { operatorList } = useOperatorList()
  
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
      <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
        <PageHeader title={'Select your Operator'} subtitle={'You can select an operator to stake, restake, unstake, your TONS.'}/>
        <Box fontFamily={theme.fonts.roboto}>
          <OpearatorTable 
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={operatorList}
            isLoading={tableLoading}
          />
        </Box>
      </Flex>
    );
}
 
export default DesktopStaking;
