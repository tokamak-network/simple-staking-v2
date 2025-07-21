import {
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	useTheme,
	Text,
	Button,
	Checkbox,
	Radio,
	RadioGroup,
	Box,
} from "@chakra-ui/react";
import useModal from "@/hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import { BalanceInput } from "@/common/input/CustomInput";
import { getStakeModalComponent } from "@/utils/getStakeModalComponent";
import CONTRACT_ADDRESS from "@/services/addresses/contract";
import { marshalString, unmarshalString } from "@/utils/marshalString";
import { padLeft } from "web3-utils";
import useCallContract from "@/hooks/useCallContract";
import {
	convertNumber,
	convertToRay,
	convertToWei,
	floatParser,
} from "@/utils/number";
import { useRecoilState, useRecoilValue } from "recoil";
import { inputBalanceState, inputState } from "@/atom/global/input";
import { useWeb3React } from "@web3-react/core";
import { txHashStatus, txState } from "@/atom/global/transaction";
import { ModalHeader } from "./modal/ModalHeader";
import { WithdrawModalBody } from "./modal/WithdrawModalBody";
import { getContract } from "@/components/getContract";
import Candidate from "services/abi/Candidate.json";
import { StakeModalComponentType } from "types";
import {
	getModeData,
	transactionModalOpenStatus,
	transactionModalStatus,
} from "@/atom/global/modal";
import { TokenTypeSelector } from "@/common/selector/TokenType";
import { UnstakeBalanceInput } from "@/common/modal/withdraw/UnstakeBalanceInput";
import useUserBalance from "@/hooks/useUserBalance";

function StakeModal() {
	const theme = useTheme();
	const { btnStyle } = theme;

	const { selectedModalData, selectedModal, closeModal, isModalLoading } =
		useModal();
	const { account, library } = useWeb3React();

	const { TON_ADDRESS, WTON_ADDRESS, DepositManager_ADDRESS } =
		CONTRACT_ADDRESS;

	const {
		TON_CONTRACT,
		WTON_CONTRACT,
		Old_DepositManager_CONTRACT,
		DepositManager_CONTRACT,
		SeigManager_CONTRACT,
	} = useCallContract();

	const [input, setInput] = useRecoilState(inputState);
	const [, setTxPending] = useRecoilState(txState);
	const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
	const [isOpen, setIsOpen] = useRecoilState(transactionModalOpenStatus);
	const [selectedMode, setSelectedMode] = useRecoilState(getModeData);
	const [, setTxHash] = useRecoilState(txHashStatus);

	const [tx, setTx] = useState();
	// const [withdrawType, setWithdrawType] = useState('new');
	const [tokenType, setTokenType] = useState("TON");
	const [modalComponent, setModalComponent] =
		useState<StakeModalComponentType>();

	const [stakeDisabled, setStakeDisabled] = useState(true);

	const { userTonBalance, userWTonBalance } = useUserBalance(account);

	useEffect(() => {
		if (selectedModal && selectedModalData)
			setModalComponent(
				getStakeModalComponent(selectedModal, selectedModalData),
			);
	}, [selectedModal, selectedModalData]);

	const closeThisModal = useCallback(() => {
		// setResetValue();
		setInput("0");
		setTokenType("TON");
		closeModal();
	}, [setInput, closeModal]);

	const getData = useCallback(() => {
		if (selectedModalData)
			return marshalString(
				[DepositManager_ADDRESS, selectedModalData.layer2]
					.map(unmarshalString)
					.map((str) => padLeft(str, 64))
					.join(""),
			);
	}, [DepositManager_ADDRESS, selectedModalData]);

	const getDataForWton = useCallback(() => {
		if (selectedModalData)
			return marshalString(
				[selectedModalData.layer2]
					.map(unmarshalString)
					.map((str) => padLeft(str, 64))
					.join(""),
			);
	}, [selectedModalData]);

	useEffect(() => {
		async function waitReceipt() {
			if (tx && !tx["status"]) {
				//@ts-ignore
				await tx.wait().then((receipt: any) => {
					if (receipt.status) {
						setModalOpen("confirmed");
						setTxPending(false);
						setTx(undefined);
						setInput("");
					}
				});
			}
		}
		waitReceipt();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tx]);

	const staking = useCallback(async () => {
		const amount = floatParser(input);
		const data = getData();
		try {
			setSelectedMode("Stake");
			setIsOpen(true);
			setModalOpen("waiting");
			if (TON_CONTRACT && amount) {
				// try {
				const tx = await TON_CONTRACT.approveAndCall(
					WTON_ADDRESS,
					convertToWei(amount.toString()),
					data,
				);
				setTx(tx);
				setTxPending(true);
				setTxHash(tx.hash);

				setModalOpen("confirming");
				// return closeThisModal()
			}
		} catch (e) {
			setModalOpen("error");
		}
		// }
	}, [
		TON_CONTRACT,
		WTON_ADDRESS,
		closeThisModal,
		getData,
		input,
		selectedModalData,
		setTx,
		setTxPending,
	]);

	const stakingWton = useCallback(async () => {
		try {
			setSelectedMode("Stake");
			setIsOpen(true);
			setModalOpen("waiting");

			const amount = floatParser(input);
			const data = getDataForWton();

			if (WTON_CONTRACT && amount) {
				const tx = await WTON_CONTRACT.approveAndCall(
					DepositManager_ADDRESS,
					convertToRay(amount.toString()),
					data,
				);
				setTx(tx);
				setTxHash(tx.hash);
				setTxPending(true);
				setModalOpen("confirming");
				// return closeThisModal();
			}
		} catch (e) {
			console.log(e);
			setModalOpen("error");
		}
	}, [
		WTON_ADDRESS,
		closeThisModal,
		getData,
		input,
		selectedModalData,
		setTx,
		setTxPending,
	]);

	const updateSeig = useCallback(async () => {
		if (account && library && selectedModalData) {
			const Candidate_CONTRACT = getContract(
				selectedModalData.layer2,
				Candidate.abi,
				library,
				account,
			);
			const tx = await Candidate_CONTRACT.updateSeigniorage();
			setTx(tx);
			setTxPending(true);
		}
	}, []);

	const btnDisabledStake = () => {
		if (selectedModalData) {
			const { tonBalance, wtonBalance } = selectedModalData;

			const disable =
				(tonBalance === "0.00" && wtonBalance === "0.00") ||
				input === "0.00" ||
				input === "" ||
				//@ts-ignore
				(tonBalance &&
				tokenType === "TON" &&
				floatParser(input) > floatParser(tonBalance)
					? true
					: false) ||
				//@ts-ignore
				(wtonBalance &&
				tokenType === "WTON" &&
				floatParser(input) > floatParser(wtonBalance)
					? true
					: false);
			setStakeDisabled(disable);
		}
	};

	useEffect(() => {
		if (selectedModalData) {
			btnDisabledStake();
		}
		/*eslint-disable*/
	}, [
		account,
		tokenType,
		input,
		selectedModalData?.pendingUnstaked,
		selectedModalData?.tonBalance,
		selectedModalData?.wtonBalance,
		selectedModalData?.withdrawable,
		selectedModalData?.old_withdrawable,
	]);

	const amountForCandidate = (value: string) => {
		let reducedValue;
		//@ts-ignore
		if (value) reducedValue = floatParser(value) - 1000;
		return reducedValue?.toLocaleString();
	};

	const seigChecker = (value: string | undefined) => {
		if (value) {
			//@ts-ignore
			return floatParser(value) < 5;
		}
	};

	return (
		<Modal
			isOpen={selectedModal === "staking"}
			isCentered
			onClose={closeThisModal}
		>
			<ModalOverlay>
				<ModalContent
					bg={"#fff"}
					w={"350px"}
					borderRadius={"15px"}
					boxShadow={"0 2px 6px 0 rgba(61, 73, 93, 0.1)"}
				>
					{modalComponent ? (
						<ModalBody>
							<Flex
								w="100%"
								flexDir={"column"}
								alignItems={"center"}
								py={"20px"}
							>
								<ModalHeader
									main={modalComponent.header}
									sub={modalComponent.subHeader}
									closeThisModal={closeThisModal}
								/>
								{/* modal body */}
								{modalComponent && selectedModalData && account ? (
									<Flex
										w={"350px"}
										borderY={"1px"}
										pb={"14px"}
										borderColor={"#f4f6f8"}
										flexDir={"column"}
										alignItems={"center"}
									>
										<Flex flexDir={"column"}>
											<TokenTypeSelector
												setTab={setTokenType}
												tab={tokenType}
											/>
										</Flex>
										<Flex
											h={
												selectedModal === "withdraw" ||
												selectedModal === "restaking"
													? ""
													: "84px"
											}
											alignItems={"center"}
											flexDir={"row"}
											justifyContent={"center"}
											w={"100%"}
										>
											<UnstakeBalanceInput
												stakedAmount={
													tokenType === "TON" ? userTonBalance : userWTonBalance
												}
												tokenType={tokenType}
											/>
										</Flex>
									</Flex>
								) : (
									""
								)}

								{/* modal footer */}
								<Flex
									flexDir={"column"}
									alignItems={"center"}
									w={"100%"}
									justifyContent={"center"}
								>
									{selectedModal === "withdraw" ? (
										""
									) : (
										<Flex
											mt={"25px"}
											color={"#2a72e5"}
											fontSize={"12px"}
											fontWeight={500}
											alignItems={"center"}
										>
											{selectedModal === "unstaking" && selectedModalData ? (
												!seigChecker(selectedModalData.seig) ? (
													<Flex color={"#2a72e5"} ml={"13px"}>
														<Text
															mr={"3px"}
															cursor={"pointer"}
															textDecoration={"underline"}
															onClick={() => updateSeig()}
														>
															Claim
														</Text>
														<Text color={"#3e495c"}>
															{modalComponent.bottomComment}
														</Text>
													</Flex>
												) : (
													<Box
														color={"#3e495c"}
														fontSize={"12px"}
														fontWeight={500}
														textAlign={"center"}
													>
														<span style={{ color: "#ff2d78" }}>Warning</span>:
														You can withdraw (W)TON to your wallet after 93,046
														blocks (~14 days) from unstaking. Remember to claim
														any unclaimed staking reward before unstaking.
													</Box>
												)
											) : selectedModal === "staking" && selectedModalData ? (
												!selectedModalData.minimumAmount ? (
													<Box
														color={"#3e495c"}
														fontSize={"12px"}
														fontWeight={500}
														textAlign={"center"}
													>
														<span style={{ color: "#ff2d78" }}>Warning</span>:
														operator have not met the minimum staked balance
														requirement (at least 1,000.1 TON). As a result,
														there will be
														<span style={{ color: "#2a72e5" }}>
															{" "}
															no staking reward
														</span>
														<span> for staking on this layer2.</span>
													</Box>
												) : (
													<Box
														color={"#3e495c"}
														fontSize={"12px"}
														fontWeight={500}
														textAlign={"center"}
													>
														<span style={{ color: "#ff2d78" }}>Warning</span>:
														Staking TON will earn you TON staking rewards.
														However, you have to unstake and wait for 93,046
														blocks (~14 days) to withdraw.
													</Box>
												)
											) : selectedModal === "restaking" ? (
												<Box
													color={"#3e495c"}
													fontSize={"12px"}
													fontWeight={500}
													textAlign={"center"}
												>
													<span style={{ color: "#ff2d78" }}>Warning</span>:
													Restaking will stake unstaked TON, and these cannot be
													withdrawn until they are unstaked again.
												</Box>
											) : (
												""
											)}
										</Flex>
									)}
									<Button
										mt={"25px"}
										w={"150px"}
										{...(selectedModal === "staking" && stakeDisabled
											? { ...btnStyle.btnDisable() }
											: { ...btnStyle.btnAble() })}
										isDisabled={
											selectedModal === "staking" ? stakeDisabled : ""
										}
										onClick={
											selectedModal === "staking" && tokenType === "TON"
												? staking
												: selectedModal === "staking" && tokenType === "WTON"
													? stakingWton
													: ""
										}
									>
										{modalComponent.buttonName}
									</Button>
								</Flex>
							</Flex>
						</ModalBody>
					) : (
						""
					)}
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
}

export default StakeModal;
