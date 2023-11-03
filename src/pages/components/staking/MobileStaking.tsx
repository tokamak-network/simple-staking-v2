import {
  Box,
  Flex,
  Text,
  useMediaQuery,
  Button,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import MobileStakeComponent from "./MobileStakeComponent";
import MobileRestakeComponent from "./MobileRestakeComponent";
import MobileUnstakeComponent from "./MobileUnstakeComponent";
import MobileWithdrawComponent from "./MobileWithdrawComponent";
import { useCandidateList } from '@/hooks/staking/useCandidateList';
import { useRecoilState } from "recoil";
import { inputState } from "@/atom/global/input";

function MobileStaking() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState("stake");
  const { candidateList } = useCandidateList();
  const [value, setValue] = useRecoilState(inputState);
  
  return (
    <Flex
      w="100%"
      height={"100%"}
      pt="30px"
      alignItems={"center"}
      flexDir="column"
    >
      <Text
        fontSize={"24px"}
        fontWeight={"bold"}
        fontFamily={theme.fonts.roboto}
        color="gray.700"
        mb="5px"
      >
        Stake tokens now
      </Text>
      <Text
        fontSize={"12px"}
        textAlign="center"
        mt="5px"
        mb="30px"
        w="250px"
        color={"gray.300"}
      >
        Stake TON or earn TON.
      </Text>
      <Flex w="100%" px="20px">
        <Flex
          bg="white.100"
          w="100%"
          h="36px"
          border="1px solid #e7ebf2"
          mt="23px"
          borderRadius={"6px"}
          p="3px"
          mb="15px"
        >
          <Button
            w="25%"
            h="100%"
            bg={selectedTab === "stake" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "stake" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => {
              setValue('')
              setSelectedTab("stake")
            }}
          >
            Stake
          </Button>
          <Button
            w="25%"
            h="100%"
            color={selectedTab === "restake" ? "white.100" : "gray.1000"}
            bg={selectedTab === "restake" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => setSelectedTab("restake")}
          >
            Re-Stake
          </Button>
          <Button
            w="25%"
            h="100%"
            bg={selectedTab === "unstake" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "unstake" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => {
              setValue('')
              setSelectedTab("unstake")
            }}
          >
            Unstake
          </Button>
          <Button
            w="25%"
            h="100%"
            bg={selectedTab === "withdraw" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "withdraw" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => {
              setSelectedTab("withdraw")
            }}
          >
            Withdraw
          </Button>
        </Flex>
      </Flex>
      {selectedTab === "withdraw" ? (
        <MobileWithdrawComponent operatorList={candidateList} />
      ) : selectedTab === "restake" ? (
        <MobileRestakeComponent operatorList={candidateList} />
      ) : selectedTab === "unstake" ? (
        <MobileUnstakeComponent 
          operatorList={candidateList} 
        />
      ) : (
        <MobileStakeComponent 
          operatorList={candidateList}
        />
      )}
    </Flex>
  );
}

export default MobileStaking;
