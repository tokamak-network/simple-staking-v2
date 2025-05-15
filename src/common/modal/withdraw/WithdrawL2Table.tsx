import { FC, useEffect } from 'react';
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
import WithdrawL2TableHeader from './WithdrawL2TableHeader';
import WithdrawL2TableRow from './WithdrawL2TableRow';
import { useTONPrice } from '@/hooks/staking/useTONPrice';

type WithdrawL2TableProps = {
  columns: Column[];
  data: any[];
}

export const WithdrawL2Table: FC<WithdrawL2TableProps> = ({
  columns,
  data,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    setPageSize,
    // state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  
  const theme = useTheme();
  const { tonPriceUSD } = useTONPrice()
  
  useEffect(() => {
    setPageSize(6)
  },[])
  
  return (
    <Flex 
      w={'320px'}
      flexDir={'column'}
      fontFamily={theme.fonts.Roboto}
      justifyContent={'start'}
      h={'100%'}
      mt={'25px'}
    >
      <Box>
        <chakra.table
          width={'320px'}
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          justifyContent={"start"}
          // mr={'30px'}
        >
          <WithdrawL2TableHeader />
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            {page && page.length !== 0 ? page.map((row: any, i) => {
              prepareRow(row);
              return [
                <chakra.tr
                  boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                  h={'30px'}
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
                      <WithdrawL2TableRow 
                        key={index}
                        index={index}
                        cell={cell}
                        tonPrice={tonPriceUSD}
                      />
                    )
                  }) : 'No history'}
                </chakra.tr>
              ]
            }) : 
              <Flex 
                fontSize={'12px'}
                minW={'100%'}
                justifyContent={'center'}
                my={'20px'}
              >
                No history
              </Flex>
            }
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}

export default WithdrawL2Table
