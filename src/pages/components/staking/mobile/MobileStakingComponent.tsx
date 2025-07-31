import {
	Button,
	Flex,
	Text,
	useTheme,
	useDisclosure,
	Link,
	RadioGroup,
	Radio,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Box,
} from "@chakra-ui/react";
import Image from "next/image";
import useUserBalance from "@/hooks/useUserBalance";
import { useWeb3React } from "@web3-react/core";
import OperatorImage from "@/common/table/staking/Oval";
import select1_arrow_inactive from "assets/images/select1_arrow_inactive.png";
import icon_close from "assets/images/icon_close.png";
import { useCallback, useEffect, useState } from "react";
import OperatorSelect from "./OperatorSelect";
import MobileCustomInput from "@/common/input/MobileCustomInput";
import {
	reStaking,
	staking,
	unstake,
	withdraw,
	wtonStaking,
} from "@/actions/StakeActions";
import useCallContract from "@/hooks/useCallContract";
import { useRecoilState, useRecoilValue } from "recoil";
import { txState } from "@/atom/global/transaction";
import { convertNumber, floatParser } from "@/components/number";
import MobileInfo from "./MobileInfo";
import { useWithdrawable } from "@/hooks/staking/useWithdrawable";
import { usePendingUnstaked } from "@/hooks/staking/usePendingUnstaked";
import { useExpectedSeig } from "@/hooks/staking/useCalculateExpectedSeig";
import { getContract } from "@/components/getContract";
import Candidate from "services/abi/Candidate.json";
import { candidateValues } from "@/atom/global/candidateList";
import { ETHERSCAN_LINK } from "@/constants";
import { MobileWithdraw } from "./MobileWithdraw";
import { WarningMessage } from "./WarningMessage";
import { SelectOperator } from "./components/SelectOperators";
import { BalanceDisplay } from "./components/BalanceDisplay";
import { selectedModalData } from "@/atom/global/modal";
import RestakeDrawer from "./MobileRestakeModal";
import CLOSE_ICON from "assets/images/popup-close-icon.svg";

function MobileStakingComponent(props: { operatorList: any; title: string }) {
	const { account, library } = useWeb3React();
	const { operatorList, title } = props;

	const { userTonBalance, userWTonBalance } = useUserBalance(account);
	const theme = useTheme();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const index = useRecoilValue(candidateValues);
	const [selectedOp, setSelectedOp] = useState<any>(
		index ? operatorList?.[index] : operatorList?.[0],
	);
	const [disabled, setDisabled] = useState<boolean>(true);
	const [amount, setAmount] = useState(0);
	const [tokenType, setTokenType] = useState("TON");
	const [minimumAmount, setMinimumAmount] = useState<boolean>(true);
	const [txPending, setTxPending] = useRecoilState(txState);
	const [tx, setTx] = useState();
	const [showCommunityModal, setShowCommunityModal] = useState(false);
	const { withdrawable, withdrawableLength } = useWithdrawable(
		selectedOp?.candidateContract,
	);
	const { pendingUnstaked } = usePendingUnstaked(
		selectedOp?.candidateContract,
		account,
	);
	const [type, setType] = useState("");

	const openDrawer = (type: string) => {
		onOpen();
		setType(type);
	};

	const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT } =
		useCallContract();

	const tonB = userTonBalance ? floatParser(userTonBalance) : 0;
	const wtonB = userWTonBalance ? floatParser(userWTonBalance) : 0;
	const expectedSeig = useExpectedSeig(
		selectedOp?.candidateContract,
		selectedOp?.stakedAmount,
		selectedOp?.candidate,
	);

	const candidateAmount = selectedOp?.stakeOfCandidate
		? convertNumber({
				amount: selectedOp?.stakeOfCandidate,
				type: "ray",
			})
		: "1000.1";

	useEffect(() => {
		// console.log(candidateAmount)
		setMinimumAmount(Number(candidateAmount) > 1000);
	}, [candidateAmount]);

	const pending = pendingUnstaked
		? convertNumber({
				amount: pendingUnstaked,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const userExpectedSeig = expectedSeig
		? convertNumber({
				amount: expectedSeig.expectedSeig,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const stakedAmount = selectedOp?.stakeOf
		? convertNumber({
				amount: selectedOp?.stakeOf,
				type: "ray",
			})
		: "";

	useEffect(() => {
		setSelectedOp(index ? operatorList[index] : operatorList[0]);
	}, [operatorList, index]);

	const updateSeig = useCallback(async () => {
		if (account && library) {
			try {
				const Candidate_CONTRACT = getContract(
					selectedOp?.candidateContract,
					Candidate.abi,
					library,
					account,
				);
				const tx = await Candidate_CONTRACT.updateSeigniorage();
				setTx(tx);
				setTxPending(true);
			} catch (e) {
				console.log(e);
				setTxPending(false);
				setTx(undefined);
			}
		}
	}, [library, selectedOp]);

	const restake = useCallback(async () => {
		if (account && library && DepositManager_CONTRACT) {
			try {
				const numPendRequest = await DepositManager_CONTRACT.numPendingRequests(
					selectedOp?.candidateContract,
					account,
				);
				const tx = await DepositManager_CONTRACT.redepositMulti(
					selectedOp?.candidateContract,
					numPendRequest,
				);
				setTx(tx);
				setTxPending(true);
			} catch (e) {
				console.log(e);
				setTxPending(false);
				setTx(undefined);
			}
		}
	}, [library, selectedOp]);

	useEffect(() => {
		const isDisabled = 
					userTonBalance === "0.00" ||
					userWTonBalance === "0.00" ||
					amount === 0 ||
					Number.isNaN(amount) ||
					amount === undefined ||
					(tonB && tokenType === "TON" && amount > tonB) ||
					(wtonB && tokenType === "WTON" && amount > wtonB) ||
					!minimumAmount;
		setDisabled(isDisabled);
	}, [title, amount, tokenType, minimumAmount]);

	const staked = selectedOp?.stakeOf
		? convertNumber({
				amount: selectedOp?.stakeOf,
				type: "ray",
				localeString: true,
			})
		: "0.00";

	const handleButtonClick = () => {
		if (title === "Stake") {
			// 커뮤니티 버전 안내 모달 표시
			setShowCommunityModal(true);
		} else {
			// 기존 로직 (다른 기능들)
			if (title === "Stake" && tokenType === "TON") {
				staking(
					userTonBalance,
					TON_CONTRACT,
					amount,
					selectedOp.candidateContract,
					setTxPending,
					setTx,
				);
			} else if (title === "Stake" && tokenType === "WTON") {
				staking(
					userWTonBalance,
					WTON_CONTRACT,
					amount,
					selectedOp.candidateContract,
					setTxPending,
					setTx,
				);
			}
		}
	};

	return (
		<>
			<Flex w="100%" px="20px" flexDir={"column"}>
				{title === "Withdraw" ? (
					<MobileWithdraw
						operatorList={operatorList}
						setSelectedOp={setSelectedOp}
						selectedOp={selectedOp}
					/>
				) : (
					<Flex
						w="100%"
						// h="205px"
						border={"1px solid #e7ebf2"}
						borderRadius="10px"
						pt="10px"
						pb="15px"
						px="20px"
						flexDir={"column"}
					>
						<BalanceDisplay
							tonBalance={
								title === "Stake"
									? userTonBalance
									: title === "Unstake"
										? staked
										: pending
							}
							wtonBalance={userWTonBalance}
						/>
						<MobileCustomInput
							w={"147px"}
							placeHolder={"0.00"}
							type={title}
							maxValue={
								title === "Stake" && tokenType === "TON"
									? userTonBalance
									: title === "Stake" && tokenType === "WTON"
										? userWTonBalance
										: staked
							}
							setAmount={setAmount}
							setTokenType={setTokenType}
							tokenType={tokenType}
							maxButton={true}
						/>
						<SelectOperator
							selectedOp={selectedOp}
							onOpen={onOpen}
							setSelectedOp={setSelectedOp}
							operatorList={operatorList}
						/>
						<Button
							mt="15px"
							bg="blue.200"
							color={"white.100"}
							_focus={{
								bg: "blue.200",
							}}
							_active={{
								bg: "blue.200",
							}}
							_hover={{
								bg: "blue.200",
							}}
							isDisabled={disabled}
							_disabled={{ bg: "#86929d", color: "#e9edf1" }}
							onClick={handleButtonClick}
						>
							{title}
						</Button>
						<WarningMessage
							title={title}
							selectedOp={selectedOp}
							minimumAmount={minimumAmount}
							account={account}
						/>
					</Flex>
				)}
				{account ? (
					<Flex flexDir={"column"}>
						<MobileInfo
							title={"Your Staked"}
							value={stakedAmount ? stakedAmount : "0.00"}
						/>
						<MobileInfo
							title={"Unclaimed Staking Reward"}
							value={userExpectedSeig ? userExpectedSeig : "-"}
						/>
					</Flex>
				) : (
					""
				)}
				{userExpectedSeig && userExpectedSeig !== "0.00" && account ? (
					<Flex
						fontSize={"11px"}
						color={"#2a72e5"}
						cursor={"pointer"}
						justifyContent={"end"}
						mt={"12px"}
						onClick={() => updateSeig()}
					>
						Update seigniorage
					</Flex>
				) : (
					""
				)}
				{account ? (
					<MobileInfo
						title={"Pending Withdrawal"}
						value={pending ? pending : "-"}
					/>
				) : (
					""
				)}
				{pending && pending !== "0.00" && account ? (
					<Flex
						fontSize={"11px"}
						color={"#2a72e5"}
						cursor={"pointer"}
						justifyContent={"end"}
						mt={"12px"}
						onClick={() => openDrawer("Restake")}
					>
						Restake
					</Flex>
				) : (
					""
				)}
				<OperatorSelect
					operatorList={operatorList}
					onClose={onClose}
					isOpen={isOpen}
					setSelectedOp={setSelectedOp}
				/>
				<RestakeDrawer
					onClose={onClose}
					isOpen={isOpen}
					type={type}
					selectedOp={selectedOp}
				/>
			</Flex>

			{/* 커뮤니티 버전 안내 모달 */}
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
}

export default MobileStakingComponent;
