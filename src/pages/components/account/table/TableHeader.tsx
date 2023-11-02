import {
  chakra,
  Text,
  Flex,
  Select,
  Box,
  Center,
  useTheme,
} from "@chakra-ui/react";
import { getColumnWidthWalletMobile } from "@/utils/getColumnWidth";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

export const TableHeader = ({}) => {
 
  return (
    <chakra.thead
      w={"700px"}
      borderBottom={"1px solid #dfe4ee"}
      px="20px"
      h={"29px"}
      alignItems={"center"}
      justifyContent={"center"}
      mb='9px'
    >
      <chakra.tr 
        fontSize={"12px"} 
        color={"#3e495c"} 
        h={"29px"} 
        minW={'700px'}
        w={'700px'}
        maxW={'700px'}
      >
        {HeaderColumn("txHash")}

        {HeaderColumn("txType")}
        {HeaderColumn("amount")}

        {HeaderColumn("status")}
      </chakra.tr>
    </chakra.thead>
  );
}

const HeaderColumn = (columnName: string) => {
  return (
    <chakra.th
      w={getColumnWidthWalletMobile(columnName)}
      textAlign={
        columnName === "Account" || columnName === "TX Hash"
          ? "left"
          : "center"
      }
    >
      {
        columnName === "txHash"
        ? "Tx Hash"
        : columnName === "txType"
        ? "Type"
        : columnName === "amount"
        ? "Amount TON"
        : columnName === "status"
        ? "Status"
        : ""
      }
    </chakra.th>
  );
};

export default TableHeader;
