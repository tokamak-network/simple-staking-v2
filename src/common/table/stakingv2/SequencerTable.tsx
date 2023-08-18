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
import { FC, useCallback, useState, useMemo, useRef } from 'react';
import HistoryTable from '../staking/HistoryTable';
import OperatorDetailInfo from '../staking/OperatorDetail';
import WalletInformation from '@/pages/components/staking/WalletInformation';
import moment from "moment";
import { convertNumber } from '../../../utils/number';
import { getCircle } from '@/common/table/staking/Circle';
import { OperatorImage } from '@/common/table/staking/Oval';
import { renderBtn } from '@/common/table/staking/RenderBTN';
import { Info } from '@/common/table/staking/OperatorInfo';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/atom/staking/toggle';
import { CandidateTable } from './CandidateTable';

type SequencerTableProps = {
  columns: Column[];
  data: any[];
  // renderDetail: Function;
  isLoading: boolean;
};

export const SequencerTable: FC<SequencerTableProps> = ({
  columns,
  data,
  // renderDetail,
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
  const focusTarget = useRef<any>([]);
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
  // @ts-ignore
  const { layer2 } = data
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(
    layer2 === undefined ? '' : layer2,
  );

  const list = [
    {
      layer2: "0xa6ccdb6b2384bbf35cfb190ce41667a1f0dbdc53",
      name: "ContractTeam_DAO2",
      kind: "candidate",
      totalStaked: "",
    },
    {
      layer2: "0xc811b0eca34f154e10afba0178ca037e4fb159c4",
      name: "ContractTeam_DAO1",
      kind: "candidate",
      totalStaked: "",
    },
    {
      layer2: "0xaeb5675424c4bd3074ba363bfffdb0e2c0a1011b",
      name: "TokamakOperator",
      kind: "sequencer",
      totalStaked: "",
    },
  ]

  const [toggle, setToggle] = useRecoilState(toggleState)
  const clickOpen = (layer2: string, index: number) => {
    setIsOpen(layer2);
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
            Sequencer
          </Flex>
          {getCircle('')}
          <Flex>
            Candidate
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
              const {layer2} = row.original;
              prepareRow(row);

              return [
                <chakra.tr
                  ref={(el) => (focusTarget.current[i] = el)}
                  key={i}
                  onClick={() => {
                    if (isOpen === layer2) {
                      setIsOpen('');
                    } else {
                      clickOpen(layer2, i);
                    }
                  }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  border={
                    isOpen === layer2 ? 'solid 1px #257eee' : '#257eee'
                  }
                  h={'74px'}
                  px={'16px'}
                  mb={'12px'}
                  w="100%"
                  bg={'white.100' }
                  boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells && row.cells.map((cell: any, index: number) => {
                    const {
                      name,
                      totalStaked,
                    } = cell.row.original;

                    const type = cell.column.id;
                    const totalStakedAmount = convertNumber({
                      amount: totalStaked, 
                      type: 'ray',
                      localeString: true
                    })
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
                            <Box mr={'12px'}>
                              <OperatorImage imageLink={''}/>
                            </Box>
                            <Text w={'176px'} color={'#304156'} fontWeight={500}>{name}</Text>
                          </Flex>
                        ) : ('')}
                        {type === 'totalStaked' ? (
                          Info('Total Staked', totalStakedAmount, 'TON')
                        ) : ('')}
                      </chakra.td>
                    )
                  })}
                </chakra.tr>,
                isOpen === layer2 ? (
                  <chakra.tr
                    boxShadow="0 1px 1px 0 rgba(96, 97, 112, 0.16)"
                    // h={'650px'}
                    key={i}
                    m={0}
                    mb={'14px'}
                    mt={5}
                    bg={'white.100'}
                    border={''}
                    borderTopWidth={0}
                    borderRadius="10px"
                  >
                    <chakra.td
                      display={'flex'}
                      w={'100%'}
                      margin={0}
                      colSpan={visibleColumns.length}
                    >
                      <CandidateTable 
                        columns={columns}
                        data={data}
                        renderDetail={renderRowSubComponent}
                        isLoading={tableLoading}
                      />
                    </chakra.td>
                  </chakra.tr>
                ) : null,
              ]
            })}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}