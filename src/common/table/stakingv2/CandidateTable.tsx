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

type CandidateTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
};

export const CandidateTable: FC<CandidateTableProps> = ({
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

  //@ts-ignore
  const { layer2 } = data;

  const [isOpen, setIsOpen] = useState(
    layer2 === undefined ? '' : layer2,
  );
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
    <Flex>
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
                  h={'74px'}
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
                  px={'16px'}
                  w="100%"
                  bg={'white.100' }
                  border={''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells && row.cells.map((cell: any, index: number) => {
                    const {
                      layer2,
                      commissionRate,
                      name,
                      kind,
                      updateCoinageTotalString,
                      userStaked,
                      yourStaked,
                    } = cell.row.original;

                    const type = cell.column.id;
                    const totalStaked = convertNumber({
                      amount: updateCoinageTotalString, 
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
                          renderBtn(layer2, isOpen)
                        ): null}
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
  )
}