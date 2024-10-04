import {FC, useState, useRef, useEffect} from 'react';
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
  Button,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import Image from 'next/image';
import { convertNumber } from '../../../utils/number';
import { getCircle } from '@/common/table/staking/Circle';
import { OperatorImage } from '@/common/table/staking/Oval';
import { renderBtn } from '@/common/table/staking/RenderBTN';
import { Info } from '@/common/table/staking/OperatorInfo';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toggleState } from '@/atom/staking/toggle';
import { useUserStaked } from '../../../hooks/staking/useUserStaked';
import { useWeb3React } from '@web3-react/core';
import { useExpectedSeig } from '@/hooks/staking/useCalculateExpectedSeig';
import BasicTooltip from '../../tooltip/index';
import { MEMBER_ADDRESS_TEMP } from '@/constants';
import { useRouter } from 'next/router';
import { useL2CandidateInfo } from '@/hooks/staking/useL2CandidateInfo';
import ContractAddressInfo from './ContractAddressInfo';
import { InfoTypeSelector } from '@/common/selector/InfoType';
import { useIsOperator } from '@/hooks/staking/useIsOperator';
import { useChangedMembers } from '@/hooks/staking/useChangedMembers';

type OpearatorTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  renderL2: Function;
  isLoading: boolean;
};

export const OpearatorTable: FC<OpearatorTableProps> = ({
  columns,
  data,
  renderDetail,
  renderL2,
  isLoading,
}) => {
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    page,
    state: {pageIndex, pageSize},
    setPageSize
  } = useTable(
    {columns, data, initialState: {pageIndex: 0, pageSize: 30}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  
  const theme = useTheme();
  const focusTarget = useRef<any>([]);

  const router = useRouter();
  const { asPath } = router;

  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        if (e.Header === 'Total Staked') {
          return e.toggleSortBy();
        }
        e.toggleSortBy();
      }
      return null;
    });
  };
  //@ts-ignore
  const { candidateContract } = data;
  const { account } = useWeb3React();

  const [isOpen, setIsOpen] = useState(
    candidateContract === undefined ? '' : candidateContract,
  );
  const [tab, setTab] = useState('staking')
  // const [members, setMembers] = useState()
  const [toggle, setToggle] = useRecoilState(toggleState)

  const { memberAddresses } = useChangedMembers()

  useEffect(() => {
    if (asPath.includes('#')) {
      
      const indexOf = asPath.indexOf('#')
      const dataIndex = page.findIndex((candidateData: any) => candidateData.original.id === asPath.slice(indexOf + 1))
      setIsOpen(asPath.slice(9));
      setToggle('All')
      setTimeout(() => {
      focusTarget?.current[dataIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
    }
  }, [])

  const clickOpen = (candidateContract: string, index: number) => {
    setIsOpen(candidateContract);
    setToggle('All')
    setTab('staking')
    setTimeout(() => {
      focusTarget?.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };
  
  return (
    <Flex w={'1100px'} flexDir={'column'} id={candidateContract}>
      <Flex justifyContent={'space-between'} mb={'15px'} ml={'17px'}>
        <Flex fontSize={'11px'} flexDir={'row'} alignItems={'center'}>
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
      <Box overflowX={'auto'}>
        <chakra.table
          width={'full'}
          // variant="simple"
          {...getTableProps()}
          display="flex"
          flexDirection="column"
        >
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            {page && page.map((row: any, i) => {
              
              const { candidateContract, stakedAmount, candidate, candidateAddOn } = row.original;
              const stakedId = candidateContract
              
              const { userStakeds } = useUserStaked(account?.toLocaleLowerCase(), stakedId.toLocaleLowerCase())
              const expectedSeig = useExpectedSeig(candidateContract, stakedAmount, candidate)
              const lockedInBridge = useL2CandidateInfo(candidateAddOn)

              const [logo, setLogo] = useState<string>('')
              const { l2Infos } = useIsOperator(candidateAddOn?.id)
              
              useEffect(() => {
                if (l2Infos) {
                  setLogo(l2Infos.logo)
                }
              }, [l2Infos])
            
              
              row.original = {
                ...row.original,
                userStakeds,
                expectedSeig,
                lockedInBridge
              }
              prepareRow(row);
              return [
                <chakra.tr
                  boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                  ref={(el) => (focusTarget.current[i] = el)}
                  h={'74px'}
                  key={i}
                  onClick={() => {
                    if (isOpen === candidateContract) {
                      setIsOpen('');
                    } else {
                      clickOpen(candidateContract, i);
                    }
                  }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  borderBottomRadius={
                    isOpen === candidateContract ? '0px' : '10px'
                  }
                  borderBottom={isOpen === candidateContract ? 'solid 2px #f4f6f8' : ''}
                  borderBottomColor={
                    isOpen === candidateContract ? '#f4f6f8' : ''
                  }
                  px={'16px'}
                  mb={'15px'}
                  w="100%"
                  bg={'white.100' }
                  border={''}
                  display="flex"
                  alignItems="center"      
                  {...row.getRowProps()}
                >
                  {row.cells && row.cells.map((cell: any, index: number) => {
                    const {
                      candidateContract,
                      candidate,
                      commissionRate,
                      name,
                      kind,
                      stakedAmount,
                      stakeOf,
                      stakeOfCandidate,
                      candidateAddOn
                      // yourStaked,
                    } = cell.row.original;
                    
                    const candidateAmount = stakeOfCandidate? convertNumber({
                      amount: stakeOfCandidate,
                      type: 'ray'
                    }) : '0.00'
              
                    const minimumAmount = Number(candidateAmount) >= 1000
                    const isMember = memberAddresses?.find((address: any) => address.member === candidate)
                    
                    const type = cell.column.id;
                    const rate = convertNumber({
                      amount: commissionRate,
                      type: 'wei',
                      // localeString: true
                    })

                    const totalStaked = convertNumber({
                      amount: stakedAmount, 
                      type: 'ray',
                      localeString: true
                    })

                    const yourStaked = stakeOf ? convertNumber({
                      //@ts-ignore
                      amount: stakeOf, 
                      type: 'ray',
                      localeString: true
                    }) : '0.00'

                    return (
                      <chakra.td
                        py={3}
                        key={index}
                        m={0}
                        w={
                          type === 'name'
                            ? '350px'
                            : type === 'totalStaked'
                            ? '235px'
                            : type === 'commisionRate'
                            ? '160px'
                            : type === 'yourStaked'
                            ? '220px'
                            : '10px'
                        }
                        pr={0}
                        display="flex"
                        alignItems="center"
                        // color={getTextColor(type, colorMode)}
                        fontSize={type === 'name' ? '20px' : '13px'}
                        fontWeight={type === 'name' ? 600 : 0}
                        {...cell.getCellProps()}
                      >
                        {type === 'name' ? (
                          <Flex alignItems={'center'} mr={'30px'}>
                            <Flex 
                              flexDir={'column'} 
                              justifyContent={isMember ? 'space-between' : 'center'} 
                              h={'25px'}
                              w={'18px'}
                              
                            >
                              {minimumAmount ? getCircle(kind) : ''}
                              {isMember ? getCircle('member') : ''}
                            </Flex>
                            <Box mr={'12px'}>
                              <OperatorImage imageLink={logo}/>
                            </Box>
                            <Text 
                              // w={'176px'} 
                              color={'#304156'} 
                              fontWeight={500}
                            >
                              {name}
                            </Text>
                            {
                              candidateAddOn !== null ?
                              <Flex
                                w={'34px'}
                                h={'18px'}
                                bgColor={'#257eee'}
                                fontSize={'12px'}
                                color={'#fff'}
                                borderRadius={'3px'}
                                justifyContent={'center'}
                                ml={'9px'}
                              >
                                L2
                              </Flex>
                              : ''
                            }
                          </Flex>
                        ) : ('')}
                        {type === 'totalStaked' ? (
                          Info('Total Staked', totalStaked, 'TON')
                        ) : ('')}
                        {type === 'commisionRate' ? (
                          (rate !== '-' && rate) ? Info('Commission Rate', (+rate) / 10000000, '%') : ('')
                        ) : ('')}
                        {type === 'yourStaked' ? (
                          (yourStaked !== '0.00' && yourStaked) ? Info('Your Staked', yourStaked, 'TON') : ('')
                        ) : ('')}
                        {type === 'expander' ? (
                          renderBtn(candidateContract, isOpen)
                        ): null}
                      </chakra.td>
                    )
                  })}
                </chakra.tr>,
                isOpen === candidateContract ? (
                  <chakra.tr
                    boxShadow="0 1px 1px 0 rgba(96, 97, 112, 0.16)"
                    // h={'650px'}
                    key={i}
                    m={0}
                    mb={'14px'}
                    mt={-5}
                    bg={'white.100'}
                    borderTop={'1px'}
                    borderTopColor={'#f4f6f8'}
                    // borderTopWidth={0}
                    borderBottomRadius="10px"
                  >
                    <chakra.td
                      display={'flex'}
                      w={'100%'}
                      margin={0}
                      colSpan={visibleColumns.length}
                    >
                      <Flex flexDir={'column'}>
                        <Flex flexDir={'row'} minW={'1000px'} justifyContent={'space-between'}>
                          {
                            candidateAddOn !== null ?
                            (
                              <InfoTypeSelector 
                                tab={tab}
                                setTab={setTab}
                              />
                            ) : ''
                          }
                          {
                              tab == 'l2' && candidateAddOn !== null ?
                              <Flex 
                                justifyContent={'center'}
                                alignItems={'center'}
                                fontSize={'13px'}
                                fontWeight={500}
                                color={'#304156'}
                              >
                                <Flex mr={'6px'}>
                                  L1 Contract address
                                </Flex>
                                <ContractAddressInfo 
                                  label={candidateAddOn}
                                />
                              </Flex> : ''
                            }
                        </Flex>
                        {
                          tab === 'l2' && candidateAddOn !== null ? 
                          renderL2({row}) :
                          renderDetail({row}) 
                        }

                      </Flex>
                    </chakra.td>
                  </chakra.tr>
                ) : null,
              ]
            })}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  );
}

export default OpearatorTable