import { getEventName } from "@/components/getEventName";
import { convertNumber } from "@/components/number";
import { chakra, Link, Text, Flex, Button } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useTheme } from "@chakra-ui/react";
import { getLayerName } from "../../../utils/getOldLayerAddress";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";
import { calcCountDown } from "../../../utils/number";
import { DEFAULT_NETWORK, ETHERSCAN_API, ETHERSCAN_LINK } from "@/constants";

type TableRowProps = {
	index: number;
	cell: any;
	delay: number;
};

export const TableRow: FC<TableRowProps> = ({ cell, delay }) => {
	// console.log(cell?.row.original)
	const {
		transactionHash,
		layer2,
		sender,
		transaction,
		timestamp,
		blockTimestamp,
		amount,
		data,
		eventName,
		from,
		blockNumber,
		candidate,
		index,
		withdrawable,
		withdrawn,
		withdrawDelay,
	} = cell?.row.original;

	const txSender = sender ? sender : from;
	const txId = transaction ? transaction.id : transactionHash;
	const txTime = timestamp ? timestamp : blockTimestamp;
	const values = amount ? amount : data?.amount;
	const candidateId = candidate ? candidate.id : layer2;
	const blockNo = transaction ? transaction.blockNumber : blockNumber;

	const theme = useTheme();
	const type = cell.column.id;
	const typeName = getEventName(eventName);
	const layerName = getLayerName(candidateId);

	const { library } = useWeb3React();
	const [remainTime, setRemainTime] = useState("");

	useEffect(() => {
		async function fetch() {
			if (typeName === "Unstake" && withdrawDelay) {
				const withdrawableBlock = Number(blockNo) + withdrawDelay;
				const currentBlock = await library.getBlockNumber();

				if (currentBlock > withdrawableBlock) {
					setRemainTime("0");
				} else {
					const remainTimes = (withdrawableBlock - currentBlock) * 12;
					setRemainTime(remainTimes.toString());
				}
			}
		}
		fetch();
	}, []);

	const withdrawableTime = (blockNumber: number) => {
		const withdrawableBlock = Number(blockNumber) + Number(withdrawDelay);

		return (
			<Flex justifyContent={"center"} flexDir={"column"}>
				{remainTime === "0" ? (
					<Flex color={"#2a72e5"}>
						{/* <Button 
                w={'80px'}
                h={'25px'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'4px'}
                border={'1px solid #2a72e5'}
                bgColor={'#fff'}
                color={'#2a72e5'}
                fontSize={'12px'}
                fontWeight={400}
              >  */}
						Withdrawable
						{/* </Button> */}
					</Flex>
				) : (
					<Flex justifyContent={"center"} flexDir={"column"}>
						<Flex flexDir={"row"}>
							<Flex mr={"3px"} color={"#304156"}>
								Withdrawable at block
							</Flex>
							<Link
								isExternal
								href={`${ETHERSCAN_LINK}/block/countdown/${withdrawableBlock}`}
								color={"#2a72e5"}
							>
								{withdrawableBlock}
							</Link>
						</Flex>
						<Flex ml={"3px"} color={"#828d99"}>
							{calcCountDown(remainTime.toString())}
						</Flex>
					</Flex>
				)}
			</Flex>
		);
	};

	return (
		<chakra.td
			key={index}
			w={
				type === "index"
					? "70px"
					: type === "txHash"
						? "160px"
						: type === "txType"
							? "170px"
							: type === "amount"
								? "190px"
								: type === "blockNumber"
									? "360px"
									: type === "status"
										? "140px"
										: ""
			}
			{...theme.STAKING_HISTORY_TABLE_STYLE.tableRow()}
			{...cell.getCellProps()}
		>
			{type === "index" ? (
				<Text color={"#304156"} textAlign={"center"} w={"100%"}>
					{index}
				</Text>
			) : (
				""
			)}
			{txId && type === "txHash" ? (
				<Link
					isExternal
					href={`https://${DEFAULT_NETWORK === "1" ? "simple" : "sepolia"}.staking.tokamak.network/staking#${candidate ? candidate.id : layer2}`}
					textAlign={"center"}
					w={"100%"}
					color={"#2a72e5"}
				>
					{candidate ? candidate.name : "Unknown"}
				</Link>
			) : (
				""
			)}
			{/* {type === 'contractAddress' ? (
        <Link
          isExternal
          href={`https://etherscan.io/address/${txSender}`}
          textAlign={'center'}
          w={'100%'}
          color={'#2a72e5'}
        >
          {layerName}
        </Link>
      ) : ('')} */}
			{type === "txType" ? (
				//@ts-ignore
				<Link
					isExternal
					href={`${ETHERSCAN_LINK}/tx/${txId}`}
					textAlign={"center"}
					w={"100%"}
					color={"#2a72e5"}
				>
					{typeName}
				</Link>
			) : (
				""
			)}
			{type === "amount" ? (
				<Text textAlign={"center"} color={"#304156"} w={"100%"}>
					{convertNumber({
						amount: values,
						type: "ray",
						localeString: true,
					})}{" "}
					TON
				</Text>
			) : (
				""
			)}
			{type === "blockNumber" ? (
				//@ts-ignore
				<Flex justifyContent={"center"} color={"#304156"} w={"100%"}>
					{typeName === "Unstake"
						? withdrawn
							? moment.unix(txTime).format("YYYY.MM.DD HH:mm:ss (Z)")
							: withdrawableTime(blockNo)
						: moment.unix(txTime).format("YYYY.MM.DD HH:mm:ss (Z)")}
				</Flex>
			) : (
				""
			)}
			{type === "status" ? (
				<Text color={"#304156"} textAlign={"center"} w={"100%"}>
					True
				</Text>
			) : (
				""
			)}
		</chakra.td>
	);
};

export default TableRow;
