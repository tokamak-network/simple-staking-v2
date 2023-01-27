import { Box, Flex, Text, useTheme, Button, chakra , Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure} from "@chakra-ui/react";
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
import { Scrollbars } from "react-custom-scrollbars";
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

  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setPageSize(data.length);
  }, [setPageSize]);
  return (
    <Flex w="100%" flexDir={'column'} mt='10px'>
      <Box w="100%">
        
        <chakra.table
          {...getTableProps()}
          display="flex"
          flexDirection="column"
          width={"100%"}
          w="100%"
        >
          <TableHeader />
        
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
            w="100%"
            alignItems={"center"}
            px="20px"
            height={"308px"}
            overflowY={"scroll"}
          >
          
              {page && page?.map((row: any, i) => {
                prepareRow(row);
                return [
                  <chakra.tr
                    h={"36px"}
                    key={i}
                    w="100%"
                    display="flex"
                    alignItems="center"
                    {...row.getRowProps()}
                  >
                    {row?.cells && row?.cells?.map((cell: any, index: number) => {
                      return (
                        //@ts-ignore
                        // eslint-disable-next-line react/jsx-key
                        <TableRow key={index} index={i} cell={cell} onOpen={onOpen}/>
                      );
                    })}
                  </chakra.tr>,
                ];
              })}
        
          </chakra.tbody>
       
        </chakra.table>
      </Box>
      {/* <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen} size='md'>
        <DrawerOverlay height="100% !important"/>
        <DrawerContent bg="white"  height="90% !important" borderRadius={'10px'}>
          <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
          <DrawerBody p='0px'>
           <iframe style={{height:'100%', width:'100%'}} src='https://etherscan.io/embed' ></iframe>
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
      {/* <iframe src='https://etherscan.io/tx/0xc3d88f6d428f52144f18d185c175f00bc8fd66052a2e5142abadc92807ab390f&embedded=true'  ></iframe> */}
    </Flex>
  );
};

export default HistoryTab;
