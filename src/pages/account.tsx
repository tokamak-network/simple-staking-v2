import { Box, Flex, Text, useTheme, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import trimAddress from "@/utils/trimAddress";
import { useState, useMemo } from "react";
import AccountTab from "./components/account/AccountTab";
// import HistoryTab from "./components/account/HistoryTab";
import MyHistoryTable from "@/common/table/wallet/MyHistoryTable";
import { MyHistoryTab } from "./components/account/MyHistoryTab";
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from "react-table";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import AccountMobile from './components/account/AccountMobile';
import Wallet from '@/pages/wallet';

function Account() {
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  return (
    <>
      {
        !mobile ?
        <Wallet /> :
        <AccountMobile />              
      }
    </>
  )
  
}

export default Account;
