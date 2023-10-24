import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";
import useOperatorList from "@/hooks/staking/useOperatorList";
import { Box, Flex, Spinner, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useMemo, useCallback, useState } from 'react';
import OperatorDetailInfo from "@/common/table/staking/OperatorDetail";
import PageHeader from "../layout/PageHeader";
import OpearatorTable from "@/common/table/staking/Operators";
import { WalletInformation } from "./WalletInformation";
import HistoryTable from "@/common/table/staking/HistoryTable";
import moment from "moment";
import { useEffect } from 'react';
import { useCandidateList } from '@/hooks/staking/useCandidateList';
import { getTransactionHistory } from '../../../utils/getTransactionHistory';
import { useUserStaked } from "@/hooks/staking/useUserStaked";
import { useWeb3React } from "@web3-react/core";
import { convertNumber } from "@/components/number";
import { useExpectedSeig } from '../../../hooks/staking/useCalculateExpectedSeig';

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
    // const { operatorList } = useOperatorList()
    const { candidateList } = useCandidateList()
    const { account } = useWeb3React();
    // console.log(operatorList)
    useEffect(() => {
      // operatorList.length === 0 ? setTableLoading(true) : setTableLoading(false)
      candidateList ? setTableLoading(false) : setTableLoading(true)
    }, [candidateList, tableLoading])
    
    const renderRowSubComponent = useCallback(
      ({row}: any) => {
      const { candidateContract, expectedSeig, candidate, yourStaked, userStakeds, stakedUserList, asCommit, operatorsHistory, pendingWithdrawal } = row.original;
      
      const txHistory = getTransactionHistory(row.original)
      const userExpectedSeig = expectedSeig? convertNumber({
        amount: expectedSeig,
        type: 'ray',
        localeString: true
      }) : '-'

      const yourStake = yourStaked ? convertNumber({
        //@ts-ignore
        amount: yourStaked.stakedAmount, 
        type: 'ray',
        localeString: true
      }) : '0.00'
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
                  value={stakedUserList.length}
                />
              </Flex>
              <Flex flexDir={'column'} alignItems={'space-between'} mt={'40px'}>
                <OperatorDetailInfo 
                  title={'Pending Withdrawal'}
                  value={'0.00'}
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
                />
              </Flex>
            </Flex>
          </Flex>
          {/* table area */}
          <Flex flexDir={'row'} mt={'60px'} ml={'70px'} justifyContent={'center'} alignItems={'center'}>
            <HistoryTable 
              columns={historyColumns}
              data={txHistory}
              tableType={'Staking'}
            />
            <HistoryTable 
              columns={historyColumns}
              data={asCommit}
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
          {candidateList.length === 0 ? 
            <Flex justifyContent="center" alignItems={"center"} h='200px'>
              <Spinner size="md" emptyColor="gray.200" color="#2775ff" />
            </Flex> :
            <OpearatorTable 
              renderDetail={renderRowSubComponent}
              columns={columns}
              // @ts-ignore
              data={candidateList}
              isLoading={tableLoading}
            />
          }
        </Box>
      </Flex>
    );
}
 
export default DesktopStaking;

