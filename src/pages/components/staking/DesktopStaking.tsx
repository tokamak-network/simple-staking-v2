import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";
import { Box, Flex, Spinner, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useMemo, useCallback, useState } from 'react';
import PageHeader from "../layout/PageHeader";
import OpearatorTable from "@/common/table/staking/Operators";
import HistoryTable from "@/common/table/staking/HistoryTable";
import { useEffect } from 'react';
import { useCandidateList } from '@/hooks/staking/useCandidateList';
import { getTransactionHistory, getCommitHistory } from '../../../utils/getTransactionHistory';
import { useWeb3React } from "@web3-react/core";
import ServiceTab from "./ServiceTab";
import UserServiceBox from "./UserServiceBox";

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
    const [currentTab, setCurrentTab] = useState('operator')

    useEffect(() => { setCurrentTab('service') }, [])

    const tabHandler = (tab: string) => {
      console.log(tab)
      setCurrentTab(tab)
      console.log(currentTab)
    }

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



      return (
        <Flex
          w="100%"
          m={0}
          justifyContent={'space-between'}
          alignItems="start"
          pt="20px"
          border={'none'}
          flexDir={'column'}
        >
          <Flex
            w={'100%'}
            flexDir={'column'}
          >
            <ServiceTab 
              setServiceTab={tabHandler}
              currentTab={currentTab}
            />
            <UserServiceBox 
              original={row.original}
            />
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

