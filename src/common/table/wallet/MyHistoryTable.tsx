import { FC, useState, useEffect } from "react";
import {
	Column,
	useExpanded,
	usePagination,
	useTable,
	useSortBy,
} from "react-table";
import { chakra, Flex, Box, useTheme } from "@chakra-ui/react";
import { Pagination } from "@/common/table/Pagination";
import { TableRow } from "@/common/table/wallet/TableRow";
import { TableHeader } from "@/common/table/wallet/TableHeader";
import useCallContract from "../../../hooks/useCallContract";

type MyHistoryTableProps = {
	columns: Column[];
	data: any[];
	isLoading: boolean;
};

export const MyHistoryTable: FC<MyHistoryTableProps> = ({
	columns,
	data,
	isLoading,
}) => {
	const [currentPageIndex, setCurrentPageIndex] = useState(0);

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
		gotoPage,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: {
				pageSize: 3,
				pageIndex: currentPageIndex,
			},
			autoResetPage: false,
		},
		useSortBy,
		useExpanded,
		usePagination,
	);

	const [currentPage, setCurrentPage] = useState(0);
	const [buttonClick, setButtonClick] = useState(Boolean);
	const [withdrawalDelay, setWithdrawalDelay] = useState(0);

	const { DepositManager_CONTRACT } = useCallContract();

	const theme = useTheme();

	useEffect(() => {
		async function fetch() {
			if (DepositManager_CONTRACT) {
				const delay = await DepositManager_CONTRACT.globalWithdrawalDelay();
				setWithdrawalDelay(Number(delay.toString()));
			}
		}
		fetch();
	}, []);

	useEffect(() => {
		setPageSize(5);
	}, [setPageSize]);

	useEffect(() => {
		if (pageIndex % 4 === 0 && buttonClick) setCurrentPage(pageIndex);
		if (pageIndex % 4 === 3 && !buttonClick) setCurrentPage(pageIndex - 3);
	}, [buttonClick, pageIndex]);

	const goPrevPage = () => {
		previousPage();
		setButtonClick(false);
	};

	const goNextPage = () => {
		nextPage();
		setButtonClick(true);
	};

	return (
		<Flex flexDir={"column"} mt={"50px"}>
			<Flex
				fontSize={"18px"}
				fontWeight={"bold"}
				mb={"15px"}
				justifyContent={"center"}
			>
				History
			</Flex>
			<Box>
				<chakra.table
					width={"full"}
					{...getTableProps()}
					display="flex"
					flexDirection="column"
					mr={"30px"}
				>
					<TableHeader />
					<chakra.tbody
						{...getTableBodyProps()}
						display="flex"
						flexDirection="column"
					>
						{page &&
							page.map((row: any, i) => {
								prepareRow(row);

								return [
									<chakra.tr
										h={"38px"}
										key={i}
										w="100%"
										border={""}
										display="flex"
										alignItems="center"
										{...row.getRowProps()}
									>
										{row.cells &&
											row.cells.map((cell: any, index: number) => {
												return (
													//@ts-ignore
													// eslint-disable-next-line react/jsx-key
													<TableRow
														key={index}
														index={i}
														cell={cell}
														delay={withdrawalDelay}
													/>
												);
											})}
									</chakra.tr>,
								];
							})}
						<Pagination
							columns={columns}
							data={data}
							currentPage={currentPage}
							prevPage={goPrevPage}
							nextPage={goNextPage}
							visibleColumns={visibleColumns}
							canPreviousPage={canPreviousPage}
							canNextPage={canNextPage}
							pageOptions={pageOptions}
							pageIndex={pageIndex}
							gotoPage={gotoPage}
						/>
					</chakra.tbody>
				</chakra.table>
			</Box>
		</Flex>
	);
};

export default MyHistoryTable;
