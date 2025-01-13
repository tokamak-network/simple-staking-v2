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
} from '@chakra-ui/react';
import { WithdrawTableHeader } from './WithdrawTableHeader';
import WithdrawTableRow from './WithdrawTableRow';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { useTONPrice } from '@/hooks/staking/useTONPrice';

type WithdrawTableProps = {
  columns: Column[];
  data: any[];
  toggle: string;
}

export const WithdrawTable: FC<WithdrawTableProps> = ({
  columns,
  data,
  toggle
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
  const theme = useTheme();
  
  const { tonPriceUSD } = useTONPrice()

  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  useEffect(() => {
    setPageSize(data.length)
  },[setPageSize])
  
  return (
    <Flex 
      w={mobile ? '100%' : '320px'}
      flexDir={'column'}
      fontFamily={theme.fonts.Roboto}
      justifyContent={'start'}
      h={'100%'}
    >
      {/* <Box> */}
        <chakra.table
          width={mobile ? '100%' : '320px'}
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          justifyContent={"start"}
          mr={mobile ? '0px' : '30px'}
          border={"none"}
        >
          <WithdrawTableHeader />
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            {page && page.length > 0 ? page.map((row: any, i) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <chakra.tr
                    boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                    h={'38px'}
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
                          tonPrice={tonPriceUSD}
                          toggle={toggle}
                        />
                      )
                    }) : 'No transaction history'}
                  </chakra.tr>
                </Fragment>
              )
            }) : ''}
          </chakra.tbody>
        </chakra.table>
      {/* </Box> */}
    </Flex>
  )
}

export default WithdrawTable
