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
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import useOperatorList from "@/hooks/staking/useOperatorList";
import { OperatorImage } from "@/common/table/staking/Oval";
import moment from "moment";
import { useState } from "react";
import icon_close from "assets/images/icon_close.png";
import Back from "assets/images/Back.png";
import Image from "next/image";
import useUserBalance from "@/hooks/useUserBalance";
import OperatorInfoSub from "./OperatorInfoSub";
import { convertNumber } from "utils/number";
import MobileCustomInput from "@/common/input/MobileCustomInput";
import { floatParser } from "@/components/number";
import { staking } from "@/actions/StakeActions";
import useCallContract from "@/hooks/useCallContract";
import { useRecoilState, useRecoilValue } from "recoil";
import { txState } from "@/atom/global/transaction";
import { useWithdrawable } from "@/hooks/staking/useWithdrawable";

function OperatorCard(props: { operator: any }) {
  const { operator } = props;
  const { withdrawable, withdrawableLength ,notWithdrawable} = useWithdrawable(operator?.layer2)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();
  const { account } = useWeb3React();
  const { userTonBalance } = useUserBalance(account);

  const { operatorList } = useOperatorList();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const tonB = userTonBalance ? floatParser(userTonBalance) : 0;
  const [txPending, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();

  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT } =
    useCallContract();

  const delay = () => {
    const operatorDelay = parseInt(operator?.withdrawalDelay);
    const globalDelay = parseInt(operator?.globalWithdrawalDelay);
    if (operatorDelay > globalDelay) {
      return operatorDelay;
    } else {
      return globalDelay;
    }
  };

  const tabs = [
    {
      title: "Website",
      value:
        operator?.name === "tokamak1"
          ? "https://tokamak.network"
          : operator?.website,
    },
    { title: "Description", value: operator?.description },
    { title: "Operator Address", value: operator?.operator },
    { title: "Operator Contract", value: operator?.layer2 },
    { title: "Chain ID", value: operator?.chainId },
    { title: "Commit Count", value: operator?.commit.length },
    {
      title: "Recent Commit",
      value: operator?.commit[0]
        ? `${moment.unix(operator?.commit[0].blockTimestamp).fromNow()}`
        : "",
    },
    {
      title: "Running Time",
      value: operator?.commit[0]
        ? `${moment.unix(operator?.deployedAt).fromNow(true)}`
        : "",
    },
    {
      title: "Commission Rate",
      value: ` ${operator?.isCommissionRateNegative ? "-" : ""}
    ${
      Number(
        operator?.commissionRate.toLocaleString("fullwide", {
          useGrouping: false,
        })
      ) / 10000000
    }
    %`,
    },
    {
      title: "Total Staked",
      value: `${convertNumber({
        amount: operator?.updateCoinageTotalString,
        type: "ray",
        localeString: true,
      })} TON`,
    },
    { title: "My Staked", value: `${operator?.yourStaked} TON` },
    {
      title: "Not Withdrawable",
      value: notWithdrawable,
    },
    {
      title: "Withdrawable",
      value: withdrawable,
    },
    {
      title: "New Commission Rate",
      value: ` ${operator?.delayedCommissionRateNegative ? "-" : ""}
    ${
      Number(
        operator?.delayedCommissionRate.toLocaleString("fullwide", {
          useGrouping: false,
        })
      ) / 10000000
    }
    %`,
    },
    {
      title: "New Commission Rate Changed At",
      value: operator?.delayedCommissionBlock?.toString(),
    },
    { title: "Withdrawal Delay", value: delay() },
  ];
  
  return (
    <Flex
      mb="15px"
      h={open ? "350px" : "78px"}
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
              {operator?.isCommissionRateNegative ? "-" : ""}
              {Number(
                operator?.commissionRate.toLocaleString("fullwide", {
                  useGrouping: false,
                })
              ) / 10000000}
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
              {operator?.commit[0]
                ? `${moment.unix(operator?.commit[0].blockTimestamp).fromNow()}`
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
              {operator?.yourStaked} TON
            </Text>
          </Flex>
          <Flex borderBottom={"1px solid #e7ebf2"}></Flex>
          <Flex
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
              {userTonBalance} TON
            </Text>
          </Flex>
          {/* <Flex
            h="40px"
            border="1px solid #dfe4ee"
            borderRadius={"4px"}
            justifyContent="space-between"
            alignItems={"center"}
            px="10px"
            fontSize={"13px"}
          >
            <Text color="gray.700">Amount</Text>
            <NumberInput
              borderColor={"transparent"}
              _focus={{
                borderColor: "transparent",
              }}
              _active={{
                borderColor: "transparent",
              }}
              _hover={{
                borderColor: "transparent",
              }}
              focusBorderColor="transparent"
            >
              <NumberInputField
                textAlign={"right"}
                border="none"
                _focus={{
                  borderWidth: 0,
                }}
                pr="0px"
                _active={{
                  borderWidth: 0,
                }}
              ></NumberInputField>
            </NumberInput>
            <Text ml="7px">TON</Text>
          </Flex> */}

          <MobileCustomInput
            w="280px"
            placeHolder={"0.00"}
            type={"staking"}
            maxValue={userTonBalance}
            setAmount={setAmount}
            maxButton={false}
            txt={"Amount"}
          />
          <Button
            mt="15px"
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
              (tonB ? amount > tonB : false)
            }
            _disabled={{ bg: "#86929d", color: "#e9edf1" }}
            onClick={() =>
              staking(
                userTonBalance,
                TON_CONTRACT,
                amount,
                operator?.layer2,
                setTxPending,
                setTx
              )
            }
          >
            Stake
          </Button>
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
              {operator?.name}
            </Text>

            <Flex fontSize="11px" color={"gray.300"}>
              <Text>
                Commission Rate{" "}
                <span>
                  {" "}
                  {operator?.isCommissionRateNegative ? "-" : ""}
                  {Number(
                    operator?.commissionRate.toLocaleString("fullwide", {
                      useGrouping: false,
                    })
                  ) / 10000000}
                  %
                </span>
              </Text>
              <Text>
                {" "}
                {operator?.commit[0]
                  ? `, ${moment
                      .unix(operator?.commit[0].blockTimestamp)
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
                    {operator.website && operator.name ? (
                      <iframe
                        style={{ height: "100vh", width: "100%" }}
                        src={
                          operator?.name === "tokamak1"
                            ? "https://tokamak.network"
                            : operator?.website
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
                        {operator?.name}
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
