import {
	Container,
	Center,
	Box,
	Text,
	Heading,
	Button,
	Grid,
	Flex,
	useColorMode,
	useTheme,
	Link,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
} from "@chakra-ui/react";
import React, { FC, useState, useCallback } from "react";
// import {LoadingComponent} from 'components/Loading';

import { useEffect } from "react";
import useUserBalance from "@/hooks/useUserBalance";
import { useWeb3React } from "@web3-react/core";
import { usePendingUnstaked } from "@/hooks/staking/usePendingUnstaked";
import { ModalType } from "@/types/modal";
import { modalData, modalState } from "@/atom/global/modal";
import { useRecoilState } from "recoil";
import { useWithdrawable } from "../../../hooks/staking/useWithdrawable";
import { convertNumber } from "@/components/number";
import { getOldLayerAddress } from "@/components/getOldLayerAddress";
import { StakeModalDataType } from "types";
import useModal from "@/hooks/useModal";
import { minimumAmountState } from "@/atom/staking/minimumAmount";
import { useWithdrawDelay } from "@/hooks/staking/useWithdrawDelay";
import { selectedToggleState, toggleState } from "@/atom/staking/toggle";
import { selectedTypeState, typeFilterState } from "@/atom/staking/txTypeFilter";
import { useExpectedSeig } from "@/hooks/staking/useCalculateExpectedSeig";
import { useWithdrawRequests } from "../../../hooks/staking/useWithdrawable";
import { txState } from "@/atom/global/transaction";
import CLOSE_ICON from "assets/images/popup-close-icon.svg";

import Image from "next/image";
import TON_LOGO from "@/assets/images/ton_symbol.svg";
import WTON_LOGO from "@/assets/images/wton_large.svg";
import BasicTooltip from "@/common/tooltip";
import { useCalculateAPR } from "@/hooks/staking/useCalculateAPR";
import { fromNow } from "@/components/getDate";
import { ETHERSCAN_LINK } from "@/constants";
import CONTRACT_ADDRESS from "@/services/addresses/contract";

type WalletInformationProps = {
	// dispatch: AppDispatch;
	data: any;
	commitHistory: any;
};

export const WalletInformation: FC<WalletInformationProps> = ({
	data,
	// dispatch,
	commitHistory,
}) => {
	const [loading, setLoading] = useState(false);
	const { account, library } = useWeb3React();
	const { WTON_ADDRESS, TON_ADDRESS } = CONTRACT_ADDRESS;

	const [candidateContracts, setCandidateContracts] = useState("");
	const [candidates, setCandidates] = useState("");
	const [stakeOfUser, setStakeOfUser] = useState("");
	const [expSeig, setExpSeig] = useState("");
	const [name, setName] = useState("");
	const [stakeCandidate, setStakeCandidate] = useState("");
	const [minimumAmount, setMinimumAmount] = useRecoilState(minimumAmountState);
	const [minimumAmountForButton, setMinimumAmountForButton] =
		useState<boolean>(false);
	const [isOperator, setIsOperator] = useState<boolean>(false);
	const [isL2, setIsL2] = useState<boolean>(false);
	const [showCommunityModal, setShowCommunityModal] = useState(false);

	const { userTonBalance, userWTonBalance } = useUserBalance(account);

	const compounds = useCalculateAPR(data);

	// console.log(convertNumber({amount: data.commissionRate.toString(), localeString: false}), data.commissionRate)

	useEffect(() => {
		if (data) {
			setCandidateContracts(data.candidateContract);
			setCandidates(data.candidate);
			setStakeOfUser(data.stakeOf);
			setExpSeig(data.expectedSeig);
			setStakeCandidate(data.stakeOfCandidate);
			setIsL2(data.candidateAddOn !== null);
			setName(data.name);
		}
	}, [data]);

	useEffect(() => {
		if (account) {
			setIsOperator(candidates.toLowerCase() === account.toLowerCase());
		}
	}, [account, candidates]);

	const { pendingUnstaked } = usePendingUnstaked(
		data?.candidateContract,
		account,
	);
	const {
		withdrawable,
		withdrawableLength,
		old_withdrawable,
		old_withdrawableLength,
		requests,
	} = useWithdrawable(data?.candidateContract);
	const checkDelay = useWithdrawDelay(data?.candidateContract);
	const [selectedModal, setSelectedModal] = useRecoilState(modalState);
	const [, setSelectedModalData] = useRecoilState(modalData);

	const yourStaked = stakeOfUser
		? convertNumber({
				//@ts-ignore
				amount: stakeOfUser,
				type: "ray",
				localeString: true,
			})
		: "-";

	const expectedSeigs = expSeig
		? convertNumber({
				amount: expSeig,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const candidateAmountForButton = stakeCandidate
		? convertNumber({
				amount: stakeCandidate,
				type: "ray",
			})
		: "0.00";

	const candidateAmount = stakeCandidate
		? convertNumber({
				amount: stakeCandidate,
				type: "ray",
			})
		: "1000.1";

	useEffect(() => {
		// console.log(Number(candidateAmount), Number(candidateAmount) > 1000)
		setMinimumAmount(Number(candidateAmount) >= 1000);
		setMinimumAmountForButton(Number(candidateAmountForButton) > 1000);
	}, [account, candidateAmount]);

	const dataModal: StakeModalDataType = {
		tonBalance: userTonBalance ? userTonBalance : "0.00",
		wtonBalance: userWTonBalance ? userWTonBalance : "0.00",
		stakedAmount: yourStaked ? yourStaked : "0.00",
		layer2: candidateContracts,
		withdrawableLength: withdrawableLength,
		seig: expectedSeigs ? expectedSeigs : "0.00",
		candidate: candidates,
		minimumAmount: minimumAmount,
		pendingUnstaked: pendingUnstaked,
		withdrawable: withdrawable,
		// old_withdrawableLength: old_withdrawableLength,
		old_withdrawableLength: "1",
		old_withdrawable: old_withdrawable,
		old_layer2: getOldLayerAddress(candidateContracts)
			? getOldLayerAddress(candidateContracts)
			: "",
		requests: requests,
		isL2: isL2,
		apy: compounds,
		name: name,
	};

	const modalButton = useCallback(
		async (modalType: ModalType, data: any) => {
			if (modalType === "staking") {
				setShowCommunityModal(true);
			} else {
				setSelectedModal(modalType);
				setSelectedModalData(data);
			}
		},
		[dataModal],
	);

	const theme = useTheme();
	const { btnStyle } = theme;

	return (
		<>
			<Container
				maxW={"330px"}
				shadow={"md"}
				borderRadius={"lg"}
				border={"solid 1px #f4f6f8"}
				h={"137px"}
			>
				<Box w={"100%"} p={0} textAlign={"center"} px={2}>
					<Flex flexDir={"row"} py={"15px"} alignItems={"center"} mt={"10px"}>
						<Flex flexDir={"column"} h={"76px"}>
							<Flex flexDir={"column"}>
								<Flex>
									<Link
										href={`${ETHERSCAN_LINK}/address/${TON_ADDRESS}`}
										isExternal={true}
										border={"1px solid #f4f6f8"}
										w={"32px"}
										h={"32px"}
										justifyContent={"center"}
										alignItems={"center"}
										borderRadius={"100px"}
										mr={"6px"}
									>
										<Flex
											justifyContent={"center"}
											alignItems={"center"}
											w={"32px"}
											h={"32px"}
										>
											<Image src={TON_LOGO} alt={""} />
										</Flex>
									</Link>
									<Link
										href={`${ETHERSCAN_LINK}/address/${WTON_ADDRESS}`}
										isExternal={true}
										border={"1px solid #007aff"}
										w={"32px"}
										h={"32px"}
										borderRadius={"100px"}
										bgColor={"#007aff"}
									>
										<Flex
											w={"32px"}
											h={"32px"}
											justifyContent={"center"}
											alignItems={"center"}
										>
											<Image src={WTON_LOGO} alt={""} />
										</Flex>
									</Link>
								</Flex>
								<Flex
									fontSize={"11px"}
									color={"#304156"}
									fontWeight={700}
									mt={"9px"}
								>
									<Link
										href={`${ETHERSCAN_LINK}/address/${TON_ADDRESS}`}
										isExternal={true}
										textDecor={"none"}
										_hover={{
											textDecor: "none",
										}}
									>
										TON
									</Link>
									<Flex color={"#c7d1d8"} mx={"3px"}>
										/
									</Flex>
									<Link
										href={`${ETHERSCAN_LINK}/address/${WTON_ADDRESS}`}
										isExternal={true}
										textDecor={"none"}
										_hover={{
											textDecor: "none",
										}}
									>
										WTON
									</Link>
								</Flex>
							</Flex>
							<Flex
								mt={"9px"}
								fontSize={"11px"}
								color={"#2a72e5"}
								w={"100%"}
								justifyContent={"center"}
								cursor={"pointer"}
								h={"13px"}
								onClick={() => modalButton("calculator", dataModal)}
							>
								Simulator
							</Flex>
						</Flex>
						<Flex w={"1px"} h={"60px"} bgColor={"#f4f6f8"} mx={"15px"} />
						<Flex flexDir={"column"}>
							<Flex color={"#808992"} fontSize={"12px"} fontWeight={"normal"}>
								<Flex>Staking APY</Flex>
								<Flex mt={"3px"} ml={"3px"}>
									<BasicTooltip
										label={`360-day historical staking APY calculated from seigniorage update frequency, with a ${Number(data?.commissionRate.toString()) / 1e25}% commission fee to the DAO candidate`}
										width={"430px"}
									/>
								</Flex>
							</Flex>
							<Flex
								flexDir={"row"}
								alignItems={"center"}
								justifyContent={"space-between"}
							>
								<Flex
									color={"#304156"}
									fontSize={"25px"}
									fontWeight={700}
									mr={"9px"}
									w={"110px"}
								>
									{compounds === "NaN" || Number(compounds) === Infinity
										? "0.00"
										: compounds}{" "}
									%
								</Flex>
								<Button
									{...(minimumAmountForButton || isOperator
										? { ...btnStyle.btnAble() }
										: { ...btnStyle.btnDisable() })}
									isDisabled={minimumAmountForButton || isOperator ? false : true}
									fontSize={"14px"}
									w={"70px"}
									h={"29px"}
									opacity={loading === true ? 0.5 : 1}
									onClick={() => modalButton("staking", dataModal)}
								>
									Stake
								</Button>
							</Flex>
							<Flex
								color={"#808992"}
								fontSize={"11px"}
								fontWeight={400}
								flexDir={"column"}
							>
								<Flex>Seigniorage is updated</Flex>
								<Flex>
									{commitHistory && commitHistory[0]
										? fromNow(commitHistory[0].timestamp)
										: ""}
									.
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</Box>
			</Container>

			<Modal isOpen={showCommunityModal} onClose={() => setShowCommunityModal(false)} isCentered>
				<ModalOverlay />
				<ModalContent 
					bg={"#fff"} 
					w={"400px"} 
					borderRadius={"15px"} 
					boxShadow={"0 2px 6px 0 rgba(61, 73, 93, 0.1)"}
				>
					<ModalBody py={"30px"} pos={"relative"}>
						<Flex
							pos={"absolute"}
							right={"-30px"}
							top={"-30px"}
							cursor={"pointer"}
							onClick={() => setShowCommunityModal(false)}
						>
							<Image src={CLOSE_ICON} alt={"CLOSE_ICON"} />
						</Flex>
						<Flex flexDir={"column"} alignItems={"center"} textAlign={"center"}>
							<Text 
								color={"#3d495d"} 
								fontSize={"18px"} 
								fontWeight={"bold"} 
								mb={"15px"}
							>
								Tokamak Staking is transitioning to the Community Version.
							</Text>
							<Text 
								color={"#86929d"} 
								fontSize={"14px"} 
								mb={"25px"}
							>
								Staking is available on Community Version.
							</Text>
							<Link href={`https://community.staking.tokamak.network`} isExternal>
								<Button
									bg={"#2a72e5"}
									color={"white"}
									_hover={{ bg: "#1e5bb8" }}
									w={"200px"}
									h={"40px"}
									borderRadius={"8px"}
									fontSize={"14px"}
									fontWeight={500}
								>
									Go to Community Version
								</Button>
							</Link>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default WalletInformation;
