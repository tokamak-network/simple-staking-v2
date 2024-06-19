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
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    setPageSize,
    previousPage,
    nextPage,
    state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  const [currentPage, setCurrentPage] = useState(0)
  const [buttonClick, setButtonClick] = useState(Boolean)
  const [toggle, setToggle] = useRecoilState(toggleState)
  const theme = useTheme();

  console.log(data)

  useEffect(() => {
    setPageSize(3)
  },[setPageSize])

  useEffect(() => {
    if (pageIndex % 4 === 0 && buttonClick) setCurrentPage(pageIndex)
    if (pageIndex % 4 === 3 && !buttonClick) setCurrentPage(pageIndex - 3)
  }, [buttonClick, pageIndex])

  const goPrevPage = () => {
    previousPage();
    setButtonClick(false)
  };

  const goNextPage = () => {
    nextPage();
    setButtonClick(true)
  };

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
          <WithdrawTableHeader/>
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            {page ? page.map((row: any, i) => {
              prepareRow(row);
              console.log(page)
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
            {/* <Pagination 
              columns={columns}
              data={data}
              currentPage={currentPage}
              prevPage={goPrevPage}
              nextPage={goNextPage}
              visibleColumns={visibleColumns}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              pageOptions={pageOptions}
              pageIndex={pageIndex}
            /> */}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}

export default WithdrawTable
