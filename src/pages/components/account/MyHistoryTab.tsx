import { FC, useState, useEffect, useMemo } from "react";
import {
	Column,
	useExpanded,
	usePagination,
	useTable,
	useSortBy,
} from "react-table";
import { chakra, Flex, Box, useTheme, useDisclosure } from "@chakra-ui/react";
import trimAddress from "@/utils/trimAddress";
import { TableRow } from "./table/TableRow";
import { TableHeader } from "./table/TableHeader";
import { useUserHistory } from "hooks/wallet/useUserHIstory";

type MyHistoryTableProps = {
	isLoading: boolean;
};

export const MyHistoryTab: FC<MyHistoryTableProps> = ({ isLoading }) => {
	const { userHistory } = useUserHistory();

	const myHistoryColumnNames: Column<any>[] = useMemo(
		() => [
			{
				Header: "Transaction Hash",
				accessor: "txHash",
			},

			{
				Header: "Type",
				accessor: "txType",
			},
			{
				Header: "Amount",
				accessor: "amount",
			},

			{
				Header: "Status",
				accessor: "status",
			},
		],
		[],
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns: myHistoryColumnNames, data: userHistory });

	const theme = useTheme();
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Flex w="100%" flexDir={"column"} mt="10px">
			<Box w="100%">
				<chakra.table
					{...getTableProps()}
					display="flex"
					flexDirection="column"
					w={"100%"}
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
						{rows
							? rows.map((row: any, i) => {
									prepareRow(row);
									return (
										<chakra.tr
											h={"36px"}
											w="100%"
											display="flex"
											alignItems="center"
											{...row.getRowProps()}
										>
											{row.cells &&
												row.cells.map((cell: any, i: number) => {
													return <TableRow key={i} index={i} cell={cell} />;
												})}
										</chakra.tr>
									);
								})
							: ""}
					</chakra.tbody>
				</chakra.table>
			</Box>
		</Flex>
	);
};

export default MyHistoryTab;
