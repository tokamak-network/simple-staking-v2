import { FC, useState, useRef, Fragment, useEffect } from 'react';
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {
  chakra,
  Flex,
  Box,
  useTheme,
  Switch,
  Text,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { WithdrawTableHeader } from './WithdrawTableHeader';
// import { WithdrawTableRow } from './table/WithdrawTableRow';
import { Pagination } from '@/common/table/Pagination';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/atom/staking/toggle';
import WithdrawTableRow from './WithdrawTableRow';

type WithdrawTableProps = {
  columns: Column[];
  data: any[];
}

export const WithdrawTable: FC<WithdrawTableProps> = ({
  columns,
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  const [toggle, setToggle] = useRecoilState(toggleState)
  const theme = useTheme();

  useEffect(() => {
    setPageSize(data.length)
  },[setPageSize])

  return (
    <Flex 
      w={'320px'}
      flexDir={'column'}
      fontFamily={theme.fonts.Roboto}
      justifyContent={'start'}
      h={'100%'}
    >
      <Box overflowX={'auto'}>
        <chakra.table
          width={'320px'}
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          justifyContent={"start"}
          mr={'30px'}
        >
          <WithdrawTableHeader />
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            {page ? page.map((row: any, i) => {
              prepareRow(row);
              return [
                <chakra.tr
                  boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                  h={'38px'}
                  key={i}
                  w="100%"
                  bg={'white.100' }
                  border={''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells ? row.cells.map((cell: any, index: number) => {
                    return (         
                      <WithdrawTableRow 
                        key={index}
                        index={index}
                        cell={cell}
                      />
                    )
                  }) : ''}
                </chakra.tr>
              ]
            }) : ''}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}

export default WithdrawTable
