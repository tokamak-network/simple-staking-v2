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

type CandidateTableProps = {
  columns: Column[];
  data?: any[];
  renderDetail?: Function;
  isLoading: boolean;
};

export const CandidateTable: FC<CandidateTableProps> = ({
  
  
}) => {
  return (
    <Flex>
      
    </Flex>
  )
}