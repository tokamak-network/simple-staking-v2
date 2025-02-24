import {
  chakra,
  Text,
  Flex,
  Select,
  Box,
  Center,
  useTheme,
  Link,
} from "@chakra-ui/react";
import { getEventName } from "@/components/getEventName";
import { convertNumber } from "@/components/number";
import trimAddress from "@/components/trimAddress";
import moment from "moment";
import { FC } from "react";
import { getColumnWidthWallet } from "@/utils/getColumnWidth";

type TableRowProps = {
  index: number;
  cell: any;
};


export const TableRow: FC<TableRowProps>=({
  index, cell
}) =>{
  const { eventName,transactionHash, layer2, data, from, blockNumber, transaction, amount } =  cell?.row?.original || {};
  const theme = useTheme();
  const type = cell?.column.id;
  const typeName = getEventName(eventName);
  
  return (
    <chakra.td
      key={index}
      w={
        type === "txHash"
          ? "33.2%"
          : type === "txType"
          ? "26.2%"
          : type === "amount"
          ? "30%"
          : type === "status"
          ? "16.9%"
          : ""
      }
      h='36px'
      display='flex'
      alignItems={'center'}
      //   {...theme.STAKING_HISTORY_TABLE_STYLE.tableRow()}
      {...cell?.getCellProps()}
      fontSize="11px"   
    >
      {type === "txHash" ? (
        <Link
          isExternal
          href={`https://etherscan.io/tx/${transactionHash ? transactionHash : transaction.id }`}
          textAlign={"center"}
          w={"100%"}
          color={"gray.1100"}
          textDecor='underline'
        >
          {trimAddress({
            address: transactionHash ? transactionHash : transaction.id,
            firstChar: 6,
            lastChar: 4,
            dots: "...",
          })}
        </Link>
      ) : (
        ""
      )}
      {type === "txType" ? (
        //@ts-ignore
        <Text textAlign={"center"}  color={"gray.1100"} w={"100%"}>
          {typeName}
        </Text>
      ) : (
        ""
      )}
      {type === "amount" ? (
        <Text textAlign={"center"} color={"blue.200"} fontWeight={500} w={"100%"}>
          {convertNumber({
            amount: data?.amount ? data.amount : amount,
            type: "ray",
            localeString: true,
          })}
        
        </Text>
      ) : (
        ""
      )}
      {type === "status" ? (
        <Text textAlign={"center"} color={"gray.1100"} w={"100%"}>
          True
        </Text>
      ) : (
        ""
      )}
    </chakra.td>
  )
}
export default TableRow
