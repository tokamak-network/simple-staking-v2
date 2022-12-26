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
  Select,
  Box,
  Center,
  useTheme,
  Button,
  Tooltip,
  Link,
  theme,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import trimAddress from '@/components/trimAddress';
import { getEventName } from '../../../utils/getEventName';
import moment from 'moment';
import { convertNumber } from '@/components/number';

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
  },[pageIndex])

  useEffect(() => {
    if (pageIndex % 4 === 0 && buttonClick) setCurrentPage(pageIndex)
    if (pageIndex % 4 === 3 && !buttonClick) setCurrentPage(pageIndex - 3)
  }, [buttonClick, pageIndex])

  const goPrevPage = () => {
    previousPage();
    setButtonClick(false)
  };

  const goNextPage = () => {
    // if (pageIndex % 4 === 0) setCurrentPage(pageIndex)
    nextPage();
    setButtonClick(true)
    
  };

  return (
    <Flex 
      w={tableType === 'Staking' ? '640px' : '315px'}
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
          // variant="simple"
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          mr={'30px'}
        >
          <chakra.thead
            borderBottom={'1px dashed #e6eaee'}
            // mr={'30px'}
            w={'100%'}
            h={'40px'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <chakra.tr 
              fontSize={'13px'}
              color={'#808992'}
              h={'40px'}
            >
              <chakra.th
                w={
                  tableType==='Staking' ? '125px' : '0px'
                }
                textAlign={'left'}
                fontWeight={500}
              >
                {tableType==='Staking' ? 'Account Address' : ''}
              </chakra.th>
              <chakra.th
                w={'100px'}
                textAlign={'left'}
                fontWeight={500}
              >
                TX Hash
              </chakra.th>
              <chakra.th
                w={
                  tableType==='Staking' ? '80px' : '0px'
                }
                textAlign={'center'}
                fontWeight={500}
              >
                {tableType==='Staking' ? 'Type' : ''}
              </chakra.th>
              <chakra.th
                w={
                  tableType==='Staking' ? '115px' : '0px'
                }
                textAlign={'center'}
                fontWeight={500}
              >
                {tableType==='Staking' ? 'Amount' : ''}
              </chakra.th>
              <chakra.th
                w={'190px'}
                textAlign={'center'}
                fontWeight={500}
              >
                Time
              </chakra.th>
            </chakra.tr>
          </chakra.thead>
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
                    const {
                      transactionHash,
                      blockTimestamp,
                      data,
                      eventName,
                      from
                    } = cell.row.original;
                    const type = cell.column.id;
                    const typeName = getEventName(eventName)
                    return (
                      <chakra.td
                        key={index}
                        m={0}
                        w={
                          tableType === 'Staking' && type === 'account'
                            ? '125px'
                            : type === 'txHash'
                            ? '100px'
                            : tableType === 'Staking' && type === 'txType'
                            ? '80px'
                            : tableType === 'Staking' && type === 'amount'
                            ? '115px'
                            : type === 'date'
                            ? '190px'
                            : '0px'
                        }
                        pr={0}
                        display="flex"
                        alignItems="center"
                        h={'38px'}
                        fontSize={'13px'}
                        borderBottom={'1px dashed #e6eaee'}
                        {...cell.getCellProps()}
                      >
                        {tableType === 'Staking' && type === 'account' ? (
                          <Link
                            isExternal
                            href={`https://etherscan.io/address/${from}`}
                            color={'#2a72e5'}
                          >
                            {trimAddress({
                              address: from,
                              firstChar: 6,
                              lastChar: 4,
                              dots: '...'
                            })}
                          </Link>
                        ) : ('')}
                        {type === 'txHash' ? (
                          <Link
                          isExternal
                          href={`https://etherscan.io/address/${transactionHash}`}
                          color={'#2a72e5'}
                        >
                            {trimAddress({
                              address: transactionHash,
                              firstChar: 6,
                              lastChar: 4,
                              dots: '...'
                            })}
                          </Link>
                        ) : ('')}
                        {tableType === 'Staking' && type === 'txType' ? (
                          <Flex textAlign={'center'} color={'#304156'} w={'100%'}>
                            {typeName}
                          </Flex>
                        ) : ('')}
                        {tableType === 'Staking' && type === 'amount' ? (
                          <Flex textAlign={'center'} color={'#304156'} w={'115px'}>
                            {convertNumber({
                              amount: data.amount,
                              type: 'ray',
                              localeString: true,
                            })} TON
                          </Flex>
                        ) : ('')}
                        {type === 'date' ? (
                          <Flex color={'#828d99'}>
                            {moment.unix(blockTimestamp).format('YYYY.MM.DD HH:mm:ss (Z)')}
                          </Flex>
                        ) : ('')}
                      </chakra.td>
                    )
                  })}
                </chakra.tr>
              ]
            })}
            <chakra.tr
              w={'100%'}
              h={'50px'}
              // mt={-5}
              pt={'5px'}
              pr={9}
              bg={'white.100'}
              border={''}
              mb={'25px'}
              // borderBottom={'1px'}
              // borderBottomColor={'#f4f6f8'}
              borderTopWidth={0}
              borderBottomRadius="10px">
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
                        w={'24px'}
                        h={'24px'}
                        bg={'white.100'}
                        border={'solid 1px #e6eaee'}
                        color={'#e6eaee'}
                        borderRadius={4}
                        aria-label={'Previous Page'}
                        onClick={goPrevPage}
                        isDisabled={!canPreviousPage}
                        size={'sm'}
                        mr={3}
                        _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
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
                        pb={'3px'}>
                        <Text flexShrink={0}>
                          <Text
                            fontWeight="bold"
                            as="span"
                            color={pageIndex === page ? '#2a72e5' : '#94a5b7'}
                            mr={'8px'}
                            ml={'8px'}>
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
                          w={'24px'}
                          h={'24px'}
                          border={'solid 1px #e6eaee'}
                          color={'#e6eaee'}
                          bg={'white.100'}
                          borderRadius={4}
                          aria-label={'Next Page'}
                          onClick={goNextPage}
                          isDisabled={!canNextPage}
                          size={'sm'}
                          ml={3}
                          mr={'1.5625em'}
                          _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
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