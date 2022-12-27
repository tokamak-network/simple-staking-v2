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
  Text,
  Flex,
  IconButton,
  Box,
  Center,
  useTheme,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { HistoryTableHeader } from './table/HistoryTableHeader';
import { HistoryTableRow } from './table/HIstoryTableRow';

type HistoryTableProps = {
  columns: Column[];
  data: any[];
  tableType: string;
  // renderDetail: Function;
  // isLoading: boolean;
}

export const HistoryTable: FC<HistoryTableProps> = ({
  columns,
  data,
  tableType,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  const [currentPage, setCurrentPage] = useState(0)
  const [buttonClick, setButtonClick] = useState(Boolean)
  const theme = useTheme();

  useEffect(() => {
    setPageSize(5)
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
      w={tableType === 'Staking' ? '625px' : '285px'}
      flexDir={'column'}
      mr={'30px'}
      fontFamily={theme.fonts.Roboto}
    >
      <Flex fontSize={'15px'} fontWeight={'bold'} mb={'15px'}>
        {tableType}
      </Flex>
      <Box overflowX={'auto'}>
        <chakra.table
          width={'full'}
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          mr={'30px'}
        >
          <HistoryTableHeader
            tableType={tableType}
          />
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            {page.map((row: any, i) => {
              prepareRow(row);

              return [
                <chakra.tr
                  boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                  h={'38px'}
                  key={i}
                  // px={'16px'}
                  w="100%"
                  bg={'white.100' }
                  border={''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell: any, index: number) => {
                    return (
                      //@ts-ignore
                      // eslint-disable-next-line react/jsx-key
                      <HistoryTableRow 
                        index={index}
                        cell={cell}
                        tableType={tableType}
                      />
                    )
                  })}
                </chakra.tr>
              ]
            })}
            <chakra.tr
              w={tableType === 'Staking' ? '625px' : '285px'}
              {...theme.STAKING_HISTORY_TABLE_STYLE.paginationTable()}
            >
              <chakra.td
                display={'flex'}
                w={'100%'}
                margin={0}
                justifyContent="center"
                colSpan={visibleColumns.length}
              >
                <Flex justifyContent="flex-end" my={4} alignItems="center">
                  <Flex>
                    <Tooltip label="Previous Page">
                      <IconButton
                        {...theme.STAKING_HISTORY_TABLE_STYLE.paginationButton()}
                        aria-label={'Previous Page'}
                        onClick={goPrevPage}
                        isDisabled={!canPreviousPage}
                        mr={3}
                        icon={<ChevronLeftIcon h={6} w={6} />}
                      />
                    </Tooltip>
                  </Flex>
                  {pageOptions.slice(currentPage, currentPage + 4).map((page, i) => {
                    return [
                      // eslint-disable-next-line react/jsx-key
                      <Flex
                        alignItems="center"
                        p={0}
                        fontSize={'13px'}
                        // fontFamily={theme.fonts.roboto}
                        color={'#3a495f'}
                        pb={'3px'}
                      >
                        <Text flexShrink={0}>
                          <Text
                            fontWeight="bold"
                            as="span"
                            color={pageIndex === page ? '#2a72e5' : '#94a5b7'}
                            mr={'8px'}
                            ml={'8px'}
                          >
                            {page + 1}
                          </Text>
                        </Text>
                      </Flex>
                    ];
                  })}
                  <Flex >
                    <Tooltip label="Next Page">
                      <Center>
                        <IconButton
                          {...theme.STAKING_HISTORY_TABLE_STYLE.paginationButton()}
                          aria-label={'Next Page'}
                          onClick={goNextPage}
                          isDisabled={!canNextPage}
                          ml={3}
                          mr={'1.5625em'}
                          icon={<ChevronRightIcon h={6} w={6} />}
                        />
                      </Center>
                    </Tooltip>
                  </Flex>
                </Flex> 
              </chakra.td>
            </chakra.tr>
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )

}