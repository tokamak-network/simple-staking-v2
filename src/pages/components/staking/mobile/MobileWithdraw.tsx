import { Flex, useDisclosure, Text, Link, Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { WithdrawType } from "../../../../common/modal/withdraw/WithdrawType";
// import TITAN from '@/assets/images/titan_symbol.svg'
import ETHEREUM from "@/assets/images/ethereum_symbol.svg";
import { WithdrawDrawer } from "./WithdrawDrawer";
import { SelectOperator } from "./components/SelectOperators";
import { convertNumber } from "@/components/number";
import { UnstakableBalance } from "@/common/balance/UnstakableBalance";
import L2Info from "../../../../../l2_info.json";

type MobileWithdrawProps = {
	operatorList: any;
	setSelectedOp: any;
	selectedOp: any;
};

export function MobileWithdraw(args: MobileWithdrawProps) {
	const { operatorList, setSelectedOp, selectedOp } = args;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [type, setType] = useState("");
	// const [selectedOp, setSelectedOp] = useState<any>(undefined);

	const staked = selectedOp?.stakeOf
		? convertNumber({
				amount: selectedOp?.stakeOf,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const [logo, setLogoValue] = useState<string>("");

	useEffect(() => {
		if (selectedOp) {
			const infos = L2Info.find(
				(info: any) => info.candidate === selectedOp.candidate,
			);

			if (infos) {
				setLogoValue(infos.logo);
			}
		}
	}, [L2Info, selectedOp]);

	return (
		<Flex>
			<Flex
				flexDir={"column"}
				justifyContent={"space-between"}
				alignItems={"space-between"}
				mt={"20px"}
				w={"100%"}
			>
				<Flex
					px={"20px"}
					py={"5px"}
					w={"100%"}
					borderRadius={"10px"}
					border={"solid 1px #e7ebf2"}
					bg={"#fff"}
					flexDir={"column"}
					mb={"15px"}
				>
					<SelectOperator
						operatorList={operatorList}
						selectedOp={selectedOp}
						onOpen={onOpen}
						setSelectedOp={setSelectedOp}
					/>
					<UnstakableBalance stakedAmount={staked} justify={"start"} />
				</Flex>
				
				<Box
					px={"20px"}
					py={"15px"}
					w={"100%"}
					borderRadius={"10px"}
					border={"solid 1px #e7ebf2"}
					bg={"#fff"}
					mb={"15px"}
				>
					<Flex flexDir={"column"} alignItems={"center"} textAlign={"center"}>
						<Text 
							color={"#3d495d"} 
							fontSize={"16px"} 
							fontWeight={"bold"} 
							mb={"10px"}
						>
							Tokamak Staking is transitioning to the Community Version.
						</Text>
						<Text 
							color={"#86929d"} 
							fontSize={"13px"} 
							mb={"15px"}
						>
							Unstake & Withdraw are available on Community Version.
						</Text>
						<Link href={`https://community.staking.tokamak.network`} isExternal>
							<Box
								bg={"#2a72e5"}
								color={"white"}
								w={"180px"}
								h={"36px"}
								borderRadius={"8px"}
								fontSize={"13px"}
								fontWeight={500}
								display={"flex"}
								alignItems={"center"}
								justifyContent={"center"}
								cursor={"pointer"}
								_hover={{ bg: "#1e5bb8" }}
							>
								Go to Community Version
							</Box>
						</Link>
					</Flex>
				</Box>
			</Flex>
			<WithdrawDrawer
				onClose={onClose}
				isOpen={isOpen}
				type={type}
				selectedOp={selectedOp}
			/>
		</Flex>
	);
}

export default MobileWithdraw;
