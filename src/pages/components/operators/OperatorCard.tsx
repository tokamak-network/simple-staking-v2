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
import { InfoTypeSelector } from "@/common/selector/InfoType";
import { useL2CandidateInfo } from "@/hooks/staking/useL2CandidateInfo";
import { getDate } from "@/components/getDate";
import { useCalculateAPR } from "@/hooks/staking/useCalculateAPR";

function OperatorCard(props: { operator: any }) {
  const { operator } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clicked, setClicked] = useState(false);
  const [candidate, setCandidate] = useState<any>();
  const [commit, setCommit] = useState<any>();
  const [minimumAmount, setMinimumAmount] = useState<boolean>();
  const [tab, setTab] = useState('staking')
  const compounds = useCalculateAPR(operator)
  
  const theme = useTheme();
  const { account } = useWeb3React();
  const [, setCandidateIndex] = useRecoilState(candidateState)

  const { 
    withdrawable, 
    notWithdrawable
  } = useWithdrawable(operator?.candidateContract)

  const lockedInBridge = useL2CandidateInfo(operator?.candidateAddOn)

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

  const candidateAmount = candidate?.stakeOfCandidate ? convertNumber({
    amount: candidate?.stakeOfCandidate,
    type: 'ray'
  }) : '0.00'

  useEffect(() => {
    setMinimumAmount(Number(candidateAmount) > 1000)

  }, [account, candidateAmount])

  const commissionRate = candidate?.commissionRate ?
    Number(
      convertNumber({
        amount: candidate?.commissionRate,
        type: 'wei',
        localeString: false
      })
    ) / 10000000 : '0'
  
  const lockedInBridges = lockedInBridge 
    ? convertNumber({
      amount: lockedInBridge,
      type: 'ray',
      localeString: true
    }) : '0.00'

  const earned = operator?.candidateAddOn?.seigGiven[0] ?  convertNumber({
    amount: operator?.candidateAddOn?.seigGiven[0].layer2Seigs,
    type: 'ray',
    localeString: true
  }) : '0.00'
  
  const l2Tabs = [
    {
      title: 'Information', value: 'title',
    },
    {
      title: 'Bridge', value: 'https://app.bridge.tokamak.network',
    },
    {
      title: 'Block explorer', value: 'https://explorer.titan.tokamak.network',
    },
    {
      title: 'Sequencer seigniorage', value: 'title',
    },
    {
      title: 'TON locked in Bridge', value: lockedInBridges,
    },
    // {
    //   title: 'Earned seigniorage', value: earned,
    // },
  ]
  
  const tabs = [
    {
      title: "Website",
      value:
      candidate?.name === "tokamak1"
          ? "https://tokamak.network"
          : candidate?.website,
    },
    // { title: "Description", value: operator?.description },
    { title: "Operator Address", value: candidate?.candidate, type: 'address' },
    { title: "Operator Contract", value: candidate?.candidateContract, type: 'address' },
    // { title: "Chain ID", value: operator?.chainId },
    { title: "Commit Count", value: commit ? commit.length : 0 },
    {
      title: "Recent Commit",
      value: commit && commit[0]
        ? `${moment.unix(commit[0].timestamp).fromNow()}`
        : "",
    },
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
    {
      title: "L1 Contract address",
      value: "main",
    },
    {
      title: "Core",
      value: "address",
    },
    {
      title: "DAO",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "Seigniorage",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "Staking",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "DAO Candidate",
      value: "address",
    },
    {
      title: "DAO candidate",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "DAO candidate manager",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "L2 Info",
      value: "address",
    },
    {
      title: "L2 registry",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "Sequencer seigniorage manager",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "Rollup config",
      value: "",
      tooltip: "", 
      type: 'address'
    },
    {
      title: "L1 TON bridge",
      value: "",
      tooltip: "", 
      type: 'address'
    },
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
              Staking APY
            </Text>
            <Text fontSize={"13px"} color="gray.700">
              {" "}
              {candidate?.isCommissionRateNegative ? "-" : ""}
              {compounds}
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
            <Flex flexDir={'row'} justifyContent={'start'}>
              <Text
                // w={"176px"}
                fontSize="17px"
                color={"black.300"}
                fontWeight={"bold"}
              >
                {candidate?.name}
              </Text>
              {
              operator?.candidateAddOn !== null ?
              <Flex
                w={'34px'}
                h={'18px'}
                bgColor={'#257eee'}
                fontSize={'12px'}
                color={'#fff'}
                borderRadius={'3px'}
                justifyContent={'center'}
                ml={'9px'}
                mt={'3px'}
              >
                L2
              </Flex>
              : ''
            }

            </Flex>

            <Flex mt={'5px'} fontSize="11px" color={"gray.300"}>
              <Text>
                Expected APY{" "}
                <span>
                  {" "}
                  {candidate?.isCommissionRateNegative ? "-" : ""}
                  {compounds}
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
                    {
                      candidate?.candidateAddOn !== null ?
                      (
                        <InfoTypeSelector 
                          tab={tab}
                          setTab={setTab}
                          type={'mobile'}
                        />
                      ) : ''
                    }
                    {
                      tab === 'l2' ?
                      l2Tabs.map((tab: any, index: number) => (
                        <OperatorInfoSub 
                          title={tab.title}
                          value={tab.value}
                          setClicked={setClicked}
                          key={index}
                        />
                      )) :
                      tabs.map((tab: any, index: number) => (
                        <OperatorInfoSub
                          title={tab.title}
                          value={tab.value}
                          type={tab.type}
                          setClicked={setClicked}
                          key={index}
                        />
                      ))
                    }
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