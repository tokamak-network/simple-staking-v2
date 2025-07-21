import { chakra, Checkbox, Flex, useCheckbox } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { getColumnWidthWithdraw } from "@/utils/getColumnWidth";

type WithdrawTableHeaderProps = {};

export const WithdrawTableHeader: FC<WithdrawTableHeaderProps> = ({}) => {
	return (
		<chakra.thead
			borderBottom={"1px solid #f4f6f8"}
			// mr={'30px'}
			w={"100%"}
			h={"40px"}
			alignItems={"center"}
			justifyContent={"center"}
			mb={"10px"}
		>
			<chakra.tr
				fontSize={"11px"}
				fontWeight={500}
				color={"#808992"}
				h={"40px"}
			>
				<chakra.th w={getColumnWidthWithdraw("amount")}>Amount</chakra.th>
				<chakra.th w={getColumnWidthWithdraw("status")}>Withdrawn</chakra.th>
			</chakra.tr>
		</chakra.thead>
	);
};

export default WithdrawTableHeader;

const HeaderColumn = (columnName: string) => {
	return (
		<chakra.th
			// w={}
			textAlign={
				columnName === "Account" || columnName === "TX Hash" ? "left" : "center"
			}
		>
			{}
		</chakra.th>
	);
};
