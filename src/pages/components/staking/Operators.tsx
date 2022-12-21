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
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';

type OpearatorTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
};

export const OpearatorTable: FC<OpearatorTableProps> = ({
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

  const theme = useTheme();
  const focusTarget = useRef<any>([]);
  console.log('table')
  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        if (e.Header === 'Earning Per TON') {
          return e.toggleSortBy();
        }
        e.toggleSortBy(true);
      }
      return null;
    });
  };
  //@ts-ignore
  const { layer2 } = data;

  const [isOpen, setIsOpen] = useState(
    layer2 === undefined ? '' : layer2,
  );

  // const clickOpen = (layer2: string, index: number) => {
  //   setIsOpen(layer2);
  //   setTimeout(() => {
  //     focusTarget?.current[index]?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     });
  //   }, 100);
  // };

  return (
    <Flex w={'1100px'} flexDir={'column'}>
      <Flex justifyContent={'space-between'} mb={'23px'} ml={'17px'}>
        <Flex>

        </Flex>
        <Select
          w={'137px'}
          h={'32px'}
          color={'#86929d'}
          fontSize={'13px'}
          placeholder="On Sale Sort"
          onChange={onChangeSelectBox}>
          <option value="tatalStaked">Total Staked</option>
          <option value="name">Name</option>
          <option value="Recent Commit">Recent Commit</option>
          <option value="User Staked">User Staked</option>
        </Select>
      </Flex>
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
            {page.map((row: any, i) => {
              const {layer2} = row.original;
              prepareRow(row);

              return [
                <chakra.tr
                  boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
                  ref={(el) => (focusTarget.current[i] = el)}
                  h={16}
                  key={i}
                  // onClick={() => {
                  //   if (isOpen === layer2) {
                  //     setIsOpen('');
                  //   } else {
                  //     clickOpen(layer2, i);
                  //   }
                  // }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  borderBottomRadius={
                    isOpen === layer2 ? '0px' : '10px'
                  }
                  borderBottom={isOpen === layer2 ? '1px' : ''}
                  borderBottomColor={
                    isOpen === layer2 ? '#f4f6f8' : ''
                  }
                  mb={'20px'}
                  w="100%"
                  bg={'white.100' }
                  border={''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell: any, index: number) => {
                    const {
                      layer2,
                      commissionRate,
                      name,
                      operatorAmount,
                    } = cell.row.original;
                    const type = cell.column.id;
                    console.log(name)
                    return (
                      <chakra.td
                      py={3}
                      key={index}
                      m={0}
                      w={
                        type === 'name'
                          ? '362px'
                          : type === 'period'
                          ? '150px'
                          : type === 'stakeBalanceTON'
                          ? '230px'
                          : type === 'earning_per_ton'
                          ? '200px'
                          : '10px'
                      }
                      pr={0}
                      display="flex"
                      alignItems="center"
                      // color={getTextColor(type, colorMode)}
                      fontSize={type === 'name' ? '15px' : '13px'}
                      fontWeight={type === 'name' ? 600 : 0}
                      {...cell.getCellProps()}
                      >
                        {type === 'name' ? (
                          <Text w={'176px'}>{name}</Text>
                        ) : ('')}
                        {type === 'totalStaked' ? (
                          <></>
                        ) : ('')}
                        {type === 'commisionRate' ? (
                          <></>
                        ) : ('')}
                        {type === 'yourStaked' ? (
                          <></>
                        ) : ('')}

                      </chakra.td>
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
}