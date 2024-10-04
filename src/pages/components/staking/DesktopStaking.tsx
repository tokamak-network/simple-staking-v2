import { IconClose } from "@/common/Icons/IconClose";
import { IconOpen } from "@/common/Icons/IconOpen";
import { Box, Flex, Spinner, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import { useMemo, useCallback, useState } from 'react';
import PageHeader from "../layout/PageHeader";
import OpearatorTable from "@/common/table/staking/Operators";
import { useEffect } from 'react';
import { useCandidateList } from '@/hooks/staking/useCandidateList';
import { useWeb3React } from "@web3-react/core";
import { StakingInformation } from "./StakingInformation";
import L2Information from "./L2Information";
import getCircle from "@/common/table/staking/Circle";
import BasicTooltip from "@/common/tooltip/index";
import OpearatorInfo from "@/common/Operators";

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
    const { candidateList } = useCandidateList()
    const { account } = useWeb3React();

    useEffect(() => {
      candidateList ? setTableLoading(false) : setTableLoading(true)
    }, [candidateList])

    const renderL2Component = 
      useCallback(({data}: any) => {

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
            <L2Information 
              data={data}
            />
          </Flex>
        )
      }, []
    )
    
    const renderStakingComponent = 
      useCallback(({data}: any) => {
        
        return (
          <Flex
            w="100%"
            m={0}
            justifyContent={'space-between'}
            alignItems="start"
            // pt="70px"
            mt={'40px'}
            border={'none'}
            flexDir={'column'}
          >
            <StakingInformation 
              data={data}
            />
          </Flex>
        )
      }, [historyColumns]
    );
    
    return (
      <Flex minH={'80vh'} w={'100%'} mt={'36px'} flexDir={'column'} alignItems={'center'}>
        <PageHeader title={'DAO Candidates'} subtitle={'Choose a DAO candidate to stake, restake, unstake, or withdraw TON (or WTON).'}/>
        <Box fontFamily={theme.fonts.roboto} overflowX={'hidden'}>
        <Flex justifyContent={'space-between'} mb={'15px'} ml={'17px'}>
          <Flex fontSize={'11px'} flexDir={'row'} alignItems={'center'} justifyContent={'start'} w={'1100px'}>
            {getCircle('member')}
            <Flex mr={'20px'} flexDir={'row'} alignItems={'center'}>
              <Flex mr={'3px'}>
                DAO Committee Member
              </Flex>
              <BasicTooltip 
                label={'member'} 
              />
            </Flex>
            {getCircle('candidate')}
            <Flex mr={'20px'} flexDir={'row'} alignItems={'center'}>
            <Flex mr={'3px'}>
                DAO Candidate
              </Flex>
              <BasicTooltip 
                label={'candidate'} 
              />
            </Flex>
          </Flex>
        </Flex>
          {candidateList.length === 0 ? 
            <Flex justifyContent="center" alignItems={"center"} h='200px'>
              <Spinner size="md" emptyColor="gray.200" color="#2775ff" />
            </Flex> :
            <Flex flexDir={'column'}>
              <Flex flexDir={'column'}>
                {
                  candidateList.map((candidate: any, index: number) => {
                    return [
                      <OpearatorInfo 
                        key={index}
                        renderDetail={renderStakingComponent}
                        renderL2={renderL2Component}
                        data={candidate}
                        isLoading={tableLoading}
                      />
                    ]   
                  })
                }
              </Flex>
              {/* <OpearatorTable 
                renderDetail={renderStakingComponent}
                renderL2={renderL2Component}
                columns={columns}
                // @ts-ignore
                data={candidateList}
                isLoading={tableLoading}
              /> */}
            </Flex>
          }
          
        </Box>
      </Flex>
    );
}
 
export default DesktopStaking;

