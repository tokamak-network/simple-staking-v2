import {FC, useState, useRef, Fragment} from 'react';
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
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';

import { convertNumber } from '../../../utils/number';
import { getCircle } from '@/common/table/staking/Circle';
import { OperatorImage } from '@/common/table/staking/Oval';
import { renderBtn } from '@/common/table/staking/RenderBTN';
import { Info } from '@/common/table/staking/OperatorInfo';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/atom/staking/toggle';
import { useUserStaked } from '../../../hooks/staking/useUserStaked';
import { useWeb3React } from '@web3-react/core';

type OpearatorTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
};

export const OpearatorTable: FC<OpearatorTableProps> = ({
  columns,
  data,
  renderDetail,
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
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  const theme = useTheme();
  const focusTarget = useRef<any>([]);

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
  const [toggle, setToggle] = useRecoilState(toggleState)

  const clickOpen = (candidateContract: string, index: number) => {
    setIsOpen(candidateContract);
    setToggle('All')
    setTimeout(() => {
      focusTarget?.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <Flex w={'1100px'} flexDir={'column'}>
      <Flex justifyContent={'space-between'} mb={'15px'} ml={'17px'}>
        <Flex fontSize={'11px'} flexDir={'row'} alignItems={'center'}>
          {getCircle('candidate')}
          <Flex mr={'20px'}>
            DAO Candidate
          </Flex>
          {getCircle('')}
          <Flex>
            Operator
          </Flex>
        </Flex>
        <Select
          w={'145px'}
          h={'32px'}
          color={'#86929d'}
          fontSize={'13px'}
          bgColor={'#fff'}
          boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.14)'}
          borderRadius={'4px'}
          border={'none'}
          placeholder="Operator Sort"
          onChange={onChangeSelectBox}
        >
          <option value="Total Staked">Total Staked</option>
          <option value="name">Name</option>
          <option value="Recent Commit">Recent Commit</option>
          <option value="User Staked">User Staked</option>
        </Select>
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
              const { candidateContract } = row.original;
              prepareRow(row);
              const stakedId = candidateContract
              const { userStakeds } = useUserStaked(`${account?.toLocaleLowerCase()}-${stakedId.toLocaleLowerCase()}`)
              
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
                  borderBottom={isOpen === candidateContract ? '1px' : ''}
                  borderBottomColor={
                    isOpen === candidateContract ? '#f4f6f8' : ''
                  }
                  px={'16px'}
                  mb={'12px'}
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
                      commissionRate,
                      name,
                      kind,
                      stakedAmount,
                      
                      // yourStaked,
                    } = cell.row.original;

                    const type = cell.column.id;
                    const totalStaked = convertNumber({
                      amount: stakedAmount, 
                      type: 'ray',
                      localeString: true
                    })

                    const yourStaked = userStakeds[0] ? convertNumber({
                      amount: userStakeds[0].stakedAmount, 
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
                            ? '300px'
                            : type === 'totalStaked'
                            ? '235px'
                            : type === 'commisionRate'
                            ? '200px'
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
                            {getCircle(kind)}
                            <Box mr={'12px'}>
                              <OperatorImage imageLink={''}/>
                            </Box>
                            <Text w={'176px'} color={'#304156'} fontWeight={500}>{name}</Text>
                          </Flex>
                        ) : ('')}
                        {type === 'totalStaked' ? (
                          Info('Total Staked', totalStaked, 'TON')
                        ) : ('')}
                        {type === 'commisionRate' ? (
                          (commissionRate !== '-') ? Info('Commission Rate', (+commissionRate)/10000000, '%') : ('')
                        ) : ('')}
                        {type === 'yourStaked' ? (
                          (yourStaked !== '0.00') ? Info('Your Staked', yourStaked, 'TON') : ('')
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
                    border={''}
                    borderTopWidth={0}
                    borderBottomRadius="10px"
                  >
                    <chakra.td
                      display={'flex'}
                      w={'100%'}
                      margin={0}
                      colSpan={visibleColumns.length}
                    >
                      {renderDetail({row})}
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