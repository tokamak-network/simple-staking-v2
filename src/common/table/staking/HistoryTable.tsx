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
import { HistoryTableHeader } from '@/common/table/staking/HistoryTableHeader';
// import { HistoryTableRow } from './table/HistoryTableRow';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/atom/staking/toggle';
import HistoryTableRow from '@/common/table/staking/HIstoryTableRow';
import { useWeb3React } from '@web3-react/core';
import { SimplePagination } from '../SimplePagination';

type HistoryTableProps = {
  columns: Column[];
  data: any[];
  tableType: string;
  dataModal: any;
}

export const HistoryTable: FC<HistoryTableProps> = ({
  columns,
  data,
  tableType,
  dataModal
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    previousPage,
    nextPage,
    gotoPage,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns, 
      data, 
      initialState: { 
        pageSize: 3,
        pageIndex: currentPageIndex,
      }, 
      autoResetPage: false
    },
    useSortBy,
    useExpanded,
    usePagination,
  );
  const [currentPage, setCurrentPage] = useState(0)
  const [buttonClick, setButtonClick] = useState(Boolean)
  const [toggle, setToggle] = useRecoilState(toggleState)
  
  const { account } = useWeb3React()
  
  const theme = useTheme();

  useEffect(() => {
    if (account) {
      setToggle('My')
    }
  }, [])
  // const tableStateUpdateRef = useRef(false);

  // useEffect(() => {
  //   if (!tableStateUpdateRef.current) {
  //     gotoPage(0);
  //   }
  // }, [data, gotoPage]);

  // // clear our ref when the data is loaded, after we perform any side effects
  // useEffect(() => {
  //   tableStateUpdateRef.current = false;
  // }, [data]);
  
  
  useEffect(() => {
    if (pageIndex % 4 === 0 && buttonClick) setCurrentPage(pageIndex)
    if (pageIndex % 4 === 3 && !buttonClick) setCurrentPage(pageIndex - 3)
    setCurrentPageIndex(pageIndex)
  }, [pageIndex])
  
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
      w={tableType === 'Transactions' ? '625px' : '285px'}
      flexDir={'column'}
      mr={'30px'}
      fontFamily={theme.fonts.Roboto}
      justifyContent={'start'}
      h={'100%'}
      mb={'15px'}
      border={'none'}
    >
      <Flex fontSize={'15px'} fontWeight={'bold'} mb={'5px'} flexDir={'row'} w={'100%'} justifyContent={'space-between'}>
        <Flex 
          w={'100%'}
          flexDir={'row'}
          justifyContent={'space-between'}
          h={'31px'}
          mt={tableType === 'Update Seigniorage' ? '0px' : ''}
        >
          <Flex>
            <Text mt={'5px'}>
              {tableType}
            </Text>
            <Flex ml={'10px'} mb={'15px'}>
              <SimplePagination
                prevPage={goPrevPage}
                nextPage={goNextPage}
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
              />
            </Flex>

          </Flex>
          {
            tableType === 'Update Seigniorage' ?
            '' : 
            <FormControl display={'flex'} justifyContent={'end'} alignItems={'center'} mr={'10px'}>
              {
                account ?
                <Flex>
                  <FormLabel color={'#828d99'} fontSize={'11px'} mt={'2px'}>
                    {toggle} transactions
                  </FormLabel>
                    <Switch 
                      colorScheme={'green'} 
                      onChange={() =>
                        toggle === 'All'
                          ? setToggle('My')
                          : setToggle('All')
                      }
                    /> 
                </Flex> : ""
              }
            </FormControl>  
          }
        </Flex>
      </Flex>
      
        <chakra.table
          width={'full'}
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          justifyContent={"start"}
          mr={'30px'}
          border={'none'}
        >
          <HistoryTableHeader
            tableType={tableType}
          />
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
                  border={'none'}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells ? row.cells.map((cell: any, index: number) => {
                    
                    return (         
                      <HistoryTableRow 
                        key={index}
                        cell={cell}
                        tableType={tableType}
                        currentPage={currentPage}
                        selectedModalData={dataModal}
                      />
                    )
                  }) : ''}
                </chakra.tr>
              ]
            }) : ''}
            
          </chakra.tbody>
        </chakra.table>

    </Flex>
  )
}

export default HistoryTable
