import { chakra } from "@chakra-ui/react";
import { getColumnWidthWallet } from "@/utils/getColumnWidth";

export const TableHeader = ({}) => {
  return (
    <chakra.thead
      borderBottom={"1px dashed #e6eaee"}
      // mr={'30px'}
      w={"970px"}
      h={"40px"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <chakra.tr fontSize={"13px"} color={"#808992"} h={"40px"}>
        {HeaderColumn("index")}
        {HeaderColumn("txHash")}
        {HeaderColumn("contractAddress")}
        {HeaderColumn("txType")}
        {HeaderColumn("amount")}
        {HeaderColumn("blockNumber")}
      </chakra.tr>
    </chakra.thead>
  );
};

const HeaderColumn = (columnName: string) => {
  return (
    <chakra.th
      w={getColumnWidthWallet(columnName)}
      textAlign={
        columnName === "Account" || columnName === "TX Hash" ? "left" : "center"
      }
    >
      {columnName === "index"
        ? "#"
        : columnName === "txHash"
        ? "Transaction Hash"
        : columnName === "contractAddress"
        ? "Operator Contract"
        : columnName === "txType"
        ? "Type"
        : columnName === "amount"
        ? "Amount"
        : columnName === "blockNumber"
        ? "Block Number"
        : ""}
    </chakra.th>
  );
};

export default TableHeader;
