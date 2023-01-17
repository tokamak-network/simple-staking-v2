import { Box, Flex, Text, useTheme, Button, chakra } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import trimAddress from "@/utils/trimAddress";
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from "react-table";
import { FC, useState, useRef, Fragment, useEffect } from "react";

import { Pagination } from "@/common/table/Pagination";
import TableRow from "./table/TableRow";
import TableHeader from "./table/TableHeader";

type MyHistoryTableProps = {
  columns: Column[];
  data: any[];
  isLoading: boolean;
};

export const HistoryTab: FC<MyHistoryTableProps> = ({
  columns,
  data,
  isLoading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    setPageSize,
    prepareRow,
    previousPage,
    nextPage,
    page,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useSortBy,
    useExpanded,
    usePagination
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [buttonClick, setButtonClick] = useState(Boolean);
  const theme = useTheme();

  return (
    <Flex w='100%'>
      <Box w='100%' >
        <chakra.table
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          width={'100%'}
         w='100%'
        >
          <TableHeader />
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
            w='100%'
            alignItems={'center'}
          px='20px'
          >
            {page.map((row: any, i) => {
              prepareRow(row);

              return [
                <chakra.tr
              
                  h={'38px'}
                  key={i}
                  w="100%"
              
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                
                >
                  {row.cells.map((cell: any, index: number) => {
                  
                    
                    return (
                      //@ts-ignore
                      // eslint-disable-next-line react/jsx-key
                      <TableRow 
                      key={index}
                        index={i}
                        cell={cell}

                      />
                    )
                  })}
                </chakra.tr>
              ]
            })}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  );
};

export default HistoryTab;
