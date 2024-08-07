import {
  Box,
  Flex,
  Text,
  useTheme,
  Button,
  NumberInput,
  NumberInputField,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { OperatorImage } from "@/common/table/staking/Oval";
import moment from "moment";
import { useState, useEffect } from "react";
import icon_close from "assets/images/icon_close.png";
import Back from "assets/images/Back.png";
import Image from "next/image";
import OperatorInfoSub from "./OperatorInfoSub";
import { convertNumber } from "utils/number";
import { useRecoilState, useRecoilValue } from "recoil";
import { useWithdrawable } from "@/hooks/staking/useWithdrawable";
import { getCommitHistory } from '../../../utils/getTransactionHistory';
import { candidateState } from "@/atom/global/candidateList";
import { ETHERSCAN_LINK } from "@/constants";

function OperatorCard(props: { operator: any }) {
  const { operator } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clicked, setClicked] = useState(false);
  const [candidate, setCandidate] = useState<any>();
  const [commit, setCommit] = useState<any>();
  const [minimumAmount, setMinimumAmount] = useState<boolean>(false);
  
  const theme = useTheme();
  const { account } = useWeb3React();
  const [, setCandidateIndex] = useRecoilState(candidateState)

  const { 
    withdrawable, 
    notWithdrawable
  } = useWithdrawable(operator?.candidateContract)

  useEffect(() => {
    setCandidate(operator)
    const commitHistory = getCommitHistory({
      asCommit: operator?.asCommit,
      oldCommitHistory: operator?.oldCommitHistory
    })
    setCommit(commitHistory)
  }, [])
  
  
  const [open, setOpen] = useState(false);
  
  const myStaked = convertNumber({
    amount: candidate?.stakeOf,
    type: 'ray',
    localeString: true
  })
  useEffect(() => {
    if (candidate && account) {
      const candidateAmount = candidate?.stakeOfCandidate ? convertNumber({
        amount: candidate?.stakeOfCandidate,
        type: 'ray'
      }) : '0.00'
      setMinimumAmount(Number(candidateAmount) > 1000)

    }
   
  }, [candidate, account])

  const commissionRate = candidate?.commissionRate ?
    Number(
      convertNumber({
        amount: candidate?.commissionRate,
        type: 'wei',
        localeString: false
      })
    ) / 10000000 : '0'

  const tabs = [
    {
      title: "Website",
      value:
      candidate?.name === "tokamak1"
          ? "https://tokamak.network"
          : candidate?.website,
    },
    // { title: "Description", value: operator?.description },
    { title: "Operator Address", value: candidate?.candidate },
    { title: "Operator Contract", value: candidate?.candidateContract },
    // { title: "Chain ID", value: operator?.chainId },
    { title: "Commit Count", value: commit ? commit.length : 0 },
    {
      title: "Recent Commit",
      value: commit && commit[0]
        ? `${moment.unix(commit[0].timestamp).fromNow()}`
        : "",
    },
    // {
    //   title: "Running Time",
    //   value: commitHistory[0]
    //     ? `${moment.unix(operator?.deployedAt).fromNow(true)}`
    //     : "",
    // },
    {
      title: "Commission Rate",
      value: ` ${candidate?.isCommissionRateNegative ? "-" : ""}
        ${commissionRate}%`,
    },
    {
      title: "Total Staked",
      value: `${convertNumber({
        amount: candidate?.stakedAmount,
        type: "ray",
        localeString: true,
      })} TON`,
    },
    { title: "My Staked", value: `${myStaked} TON` },
    {
      title: "Not Withdrawable",
      // value: Number(notWithdrawable) + Number(old_notWithdrawable),
      value: notWithdrawable
    },
    {
      title: "Withdrawable",
      // value: Number(withdrawable) + Number(old_withdrawable),
      value: withdrawable
    },
    // {
    //   title: "New Commission Rate",
    //   value: ` ${operator?.delayedCommissionRateNegative ? "-" : ""}
    // ${
    //   Number(
    //     operator?.delayedCommissionRate.toLocaleString("fullwide", {
    //       useGrouping: false,
    //     })
    //   ) / 10000000
    // }
    // %`,
    // },
    // {
    //   title: "New Commission Rate Changed At",
    //   value: operator?.delayedCommissionBlock?.toString(),
    // },
    // { title: "Withdrawal Delay", value: delay() },
  ];
  
  return (
    <Flex
      mb="15px"
      h={open ? "" : "78px"}
      border={"1px solid #e7ebf2"}
      borderRadius="10px"
      bg="white.100"
      alignItems={"center"}
    >
      {open ? (
        <Flex w="100%" h="100%" flexDir={"column"} px="20px">
          <Flex
            h="68px"
            w="100%"
            alignItems={"center"}
            justifyContent={'space-between'}
            borderBottom={"1px solid #e7ebf2"}
          >
            <Flex>
              <OperatorImage />
              <Flex flexDir={"column"} ml="18px" justifyContent={"center"}>
                <Text
                  w={"176px"}
                  fontSize="17px"
                  color={"black.300"}
                  fontWeight={"bold"}
                >
                  {" "}
                  {operator?.name}
                </Text>
                <Text fontSize={"10px"} color="#2a72e5" onClick={onOpen}>
                  More Information
                </Text>
              </Flex>
            </Flex>
            <Flex h="24px" w="24px" onClick={() => setOpen(false)} ml={"15px"}>
              <Image src={icon_close} alt="icon_close" />
            </Flex>
          </Flex>
          <Flex
            w="100%"
            justifyContent={"space-between"}
            h="35px"
            mt="5px"
            alignItems={"center"}
          >
            <Text fontSize={"12px"} color="gray.300">
              {" "}
              Commission Rate
            </Text>
            <Text fontSize={"13px"} color="gray.700">
              {" "}
              {candidate?.isCommissionRateNegative ? "-" : ""}
              {commissionRate}
              %
            </Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent={"space-between"}
            h="35px"
            alignItems={"center"}
          >
            <Text fontSize={"12px"} color="gray.300">
              {" "}
              Most Recent Commit
            </Text>
            <Text fontSize={"13px"} color="gray.700">
              {commit && commit[0]
                ? `${moment.unix(commit[0].timestamp).fromNow()}`
                : ""}
            </Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent={"space-between"}
            h="35px"
            alignItems={"center"}
            mb="5px"
          >
            <Text fontSize={"12px"} color="gray.300">
              My Staked
            </Text>
            <Text fontSize={"13px"} color="gray.700">
              {myStaked ? myStaked : '0.00'} TON
            </Text>
          </Flex>
          <Flex
            fontSize={'12px'}
            color={'#2a72e5'}
            textDecor={'underline'}
            justifyContent={'center'}
            mb={'18px'}
          >
            <Link
              passHref
              href={'staking'}
              // onClick={() => setCandidateIndex(candidate?.candidateContract)}
              onClick={() => setCandidateIndex(candidate?.index)}
            >
              Manage Your Stake
            </Link>
          </Flex>
          {/* <Flex
            w="100%"
            justifyContent={"space-between"}
            h="35px"
            alignItems={"center"}
            my="10px"
          >
            <Text fontSize={"12px"} color="gray.300">
              Available Amount
            </Text>
            <Text fontSize={"13px"} color="gray.700">
              {userTonBalance ? userTonBalance : '0.00'} TON
            </Text>
          </Flex>
          <MobileCustomInput
            w="90%"
            placeHolder={"0.00"}
            type={"staking"}
            maxValue={tokenType === 'TON' ? userTonBalance : userWTonBalance}
            setAmount={setAmount}
            setTokenType={setTokenType}
            tokenType={tokenType}
            maxButton={false}
            txt={"Amount"}
          />
          <Button
            my="15px"
            w="100%"
            bg="blue.200"
            color="white.100"
            fontSize={"14px"}
            _focus={{ bg: "blue.200", color: "white.100" }}
            _active={{ bg: "blue.200", color: "white.100" }}
            isDisabled={
              userTonBalance === "0.00" ||
              amount === 0 ||
              Number.isNaN(amount) ||
              amount === undefined ||
              (tonB ? amount > tonB : false) ||
              candidate?.name === 'Talken'
            }
            _disabled={{ bg: "#86929d", color: "#e9edf1" }}
            onClick={() =>
              staking(
                userTonBalance,
                TON_CONTRACT,
                amount,
                candidate?.candidateContract,
                setTxPending,
                setTx
              )
            }
          >
            Stake
          </Button> */}
          {
            account && !minimumAmount ?
            <Text
              fontSize={'12px'}
              color={'#ff2d78'}
              flexDir={'row'}
              mb={'15px'}
              textAlign={'center'}
            >
              <ChakraLink
                mr={'3px'}
                href={'#'}
                color="#ff2d78"
                textDecor={'none'}
              >
                Warning: The
              </ChakraLink>
            <ChakraLink
              color={'#2a72e5'}
              mx={'3px'}
              href={`${ETHERSCAN_LINK}/address/${candidate.candidate}`}
              isExternal
            >
              operator
            </ChakraLink>
            is required to stake at least
              <ChakraLink
                isExternal
                href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
                color={'#2a72e5'}
                mx={'3px'}
              >
                1,000.1 TON
              </ChakraLink>
              on this layer2 before stakers can receive the staking reward. Users are unable to stake until this minimum collateral requirement is fulfilled.
            </Text>
            : ''
          }
        </Flex>
      ) : (
        <Flex ml="22px" onClick={() => setOpen(!open)}>
          <OperatorImage />
          <Flex ml="22px" flexDir={"column"}>
            <Text
              w={"176px"}
              fontSize="17px"
              color={"black.300"}
              fontWeight={"bold"}
            >
              {candidate?.name}
            </Text>

            <Flex fontSize="11px" color={"gray.300"}>
              <Text>
                Commission Rate{" "}
                <span>
                  {" "}
                  {candidate?.isCommissionRateNegative ? "-" : ""}
                  {commissionRate}
                  %
                </span>
              </Text>
              <Text>
                {" "}
                {commit && commit[0]
                  ? `, ${moment
                      .unix(commit[0].timestamp)
                      .fromNow()}`
                  : ""}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay height="100% !important">
          <DrawerContent
            bg="white"
            height="90% !important"
            borderRadius={"10px"}
          >
            {clicked ? (
              <>
                <DrawerHeader pt="25px" pb="20px">
                  <Flex alignItems={"center"} justifyContent="space-between">
                    <Flex h="24px" w="24px" onClick={() => setClicked(false)}>
                      <Image src={Back} alt="back" />
                    </Flex>
                    <Flex h="24px" w="24px" onClick={onClose} ml={"15px"}>
                      <Image src={icon_close} alt="icon_close" />
                    </Flex>
                  </Flex>
                </DrawerHeader>
                <DrawerBody pt="0px" px="0px">
                  <Flex
                    flexDir={"column"}
                    borderTop={"1px solid #dfe4ee"}
                    pt="20px"
                  >
                    {/* <Text>{operator.website}</Text> */}
                    {candidate.website && candidate.name ? (
                      <iframe
                        style={{ height: "100vh", width: "100%" }}
                        src={
                          candidate?.name === "tokamak1"
                            ? "https://tokamak.network"
                            : candidate?.website
                        }
                      ></iframe>
                    ) : null}
                  </Flex>
                </DrawerBody>
              </>
            ) : (
              <>
                <DrawerHeader pt="20px" pb="14px">
                  <Flex alignItems={"center"} justifyContent="space-between">
                    <Flex alignItems={"center"}>
                      <OperatorImage />
                      <Text color="black.300" fontSize={"20px"} ml="18px">
                        {candidate?.name}
                      </Text>
                    </Flex>
                    <Flex h="24px" w="24px" onClick={onClose} ml={"15px"}>
                      <Image src={icon_close} alt="icon_close" />
                    </Flex>
                  </Flex>
                </DrawerHeader>
                <DrawerBody px="20px">
                  <Flex
                    flexDir={"column"}
                    px="5px"
                    borderTop={"1px solid #dfe4ee"}
                    pt="20px"
                  >
                    {tabs.map((tab: any, index: number) => (
                      <OperatorInfoSub
                        title={tab.title}
                        value={tab.value}
                        setClicked={setClicked}
                        key={index}
                      />
                    ))}
                  </Flex>
                </DrawerBody>
              </>
            )}
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
}

export default OperatorCard;
