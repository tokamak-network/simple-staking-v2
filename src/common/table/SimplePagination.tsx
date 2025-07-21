import { FC } from "react";
import { Column } from "react-table";
import {
	chakra,
	Text,
	Flex,
	IconButton,
	Center,
	useTheme,
	Tooltip,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

type PaginationProps = {
	prevPage: any;
	nextPage: any;
	canPreviousPage: any;
	canNextPage: any;
};

export const SimplePagination: FC<PaginationProps> = ({
	// columns,
	// data,
	// currentPage,
	prevPage,
	nextPage,
	canPreviousPage,
	canNextPage,
	// pageOptions,
	// pageIndex,
	// gotoPage
}) => {
	const theme = useTheme();

	return (
		<Flex
			w={"100%"}
			{...theme.STAKING_HISTORY_TABLE_STYLE.paginationTable()}
			mb={"1px"}
		>
			<Flex alignItems="start">
				<Flex mb={"10px"} mr={"-5px"}>
					<Tooltip label="Previous Page">
						<IconButton
							{...theme.STAKING_HISTORY_TABLE_STYLE.paginationButton2()}
							aria-label={"Previous Page"}
							onClick={prevPage}
							isDisabled={!canPreviousPage}
							icon={
								<ChevronLeftIcon
									h={"21px"}
									w={"21px"}
									color={"#86929d"}
									_hover={{ color: "#2a72e5" }}
								/>
							}
						/>
					</Tooltip>
				</Flex>
				<Flex mr={"3px"}>
					<Tooltip label="Next Page">
						<Center>
							<IconButton
								{...theme.STAKING_HISTORY_TABLE_STYLE.paginationButton2()}
								aria-label={"Next Page"}
								onClick={nextPage}
								isDisabled={!canNextPage}
								ml={3}
								// mr={'1.5625em'}
								icon={
									<ChevronRightIcon
										h={"21px"}
										w={"21px"}
										color={"#86929d"}
										_hover={{ color: "#2a72e5" }}
									/>
								}
							/>
						</Center>
					</Tooltip>
				</Flex>
			</Flex>
		</Flex>
	);
};
