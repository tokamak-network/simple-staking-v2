import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";
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
import { getTransactionHistory, getCommitHistory } from '../../../utils/getTransactionHistory';
import { useWeb3React } from "@web3-react/core";
import { convertNumber } from "@/components/number";

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
    const { candidateList, noStakingRewardList } = useCandidateList()
    const { account } = useWeb3React();

    useEffect(() => {
      candidateList ? setTableLoading(false) : setTableLoading(true)
    }, [candidateList, tableLoading])
    
    const renderRowSubComponent = useCallback(
      ({row}: any) => {
      const { 
        candidateContract, 
        expectedSeig, 
        candidate, 
        pending, 
        stakeOf, 
        stakedUserList, 
        asCommit,
        stakeOfCandidate
      } = row.original;
      const txHistory = getTransactionHistory(row.original)
      const commitHistory = getCommitHistory(row.original)

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
                  value={pendingUnstaked}
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
    }, [historyColumns]);
    
    
    return (
      <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
        <PageHeader title={'DAO Candidates'} subtitle={'Choose a DAO candidate to stake, restake, unstake, or withdraw TON (or WTON).'}/>
        <Box fontFamily={theme.fonts.roboto}>
          {candidateList.length === 0 ? 
            <Flex justifyContent="center" alignItems={"center"} h='200px'>
              <Spinner size="md" emptyColor="gray.200" color="#2775ff" />
            </Flex> :
            <Flex flexDir={'column'}>
              <OpearatorTable 
                renderDetail={renderRowSubComponent}
                columns={columns}
                // @ts-ignore
                data={candidateList}
                isLoading={tableLoading}
              />
            </Flex>
          }
          {
          noStakingRewardList.length !== 0 ? (
            <Flex flexDir={'column'}>
              <OpearatorTable 
                renderDetail={renderRowSubComponent}
                columns={columns}
                // @ts-ignore
                data={noStakingRewardList}
                isLoading={tableLoading}
              />
            </Flex>
          ) : (
            <Flex />
          )
        }
        </Box>
      </Flex>
    );
}
 
export default DesktopStaking;

