import { FC } from 'react';
import {
  Column,
} from 'react-table';
import {
  chakra,
  Text,
  Flex,
  IconButton,
  Center,
  useTheme,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

type PaginationProps = {
  columns: Column[];
  data: any[];
  currentPage: any
  prevPage: any
  nextPage: any
  visibleColumns: any
  canPreviousPage: any
  canNextPage: any
  pageOptions: any
  pageIndex: any
  gotoPage: any
}

export const Pagination: FC<PaginationProps> = ({
  columns,
  data,
  currentPage,
  prevPage,
  nextPage,
  visibleColumns,
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageIndex,
  gotoPage
}) => {
  const theme = useTheme();
  
  return (
    <chakra.tr
      w={'100%'}
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
                onClick={prevPage}
                isDisabled={!canPreviousPage}
                mr={3}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>
          {pageOptions.slice(currentPage, currentPage + 4).map((page: any, i: any) => {
            return [
              // eslint-disable-next-line react/jsx-key
              <Flex
                key={i}
                alignItems="center"
                p={0}
                fontSize={'13px'}
                // fontFamily={theme.fonts.roboto}
                color={'#3a495f'}
                pb={'3px'}
                onClick={() => gotoPage(page)}
                cursor={'pointer'}
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
                  onClick={nextPage}
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
  )
}