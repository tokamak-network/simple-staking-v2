import {
  Box,
  Flex,
  Text,
  useMediaQuery,
  Button,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import MobileStakingComponent from "./MobileStakingComponent";
import { useCandidateList } from '@/hooks/staking/useCandidateList';
import { useRecoilState } from "recoil";
import { inputState } from "@/atom/global/input";
import MobileInfo  from "./MobileInfo";
import { useWeb3React } from "@web3-react/core";

function MobileStaking() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState("Stake");
  const { candidateList, noStakingRewardList } = useCandidateList();
  const [value, setValue] = useRecoilState(inputState);
  const { account } = useWeb3React();
  
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
        Stake
      </Text>
      <Text
        fontSize={"12px"}
        textAlign="center"
        mt="5px"
        mb="20px"
        w="100%"
        color={"gray.300"}
      >
        Stake TON (or WTON) to earn staking rewards.
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
            bg={selectedTab === "Stake" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "Stake" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => {
              setValue('')
              setSelectedTab("Stake")
            }}
          >
            Stake
          </Button>
          <Button
            w="25%"
            h="100%"
            color={selectedTab === "Restake" ? "white.100" : "gray.1000"}
            bg={selectedTab === "Restake" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => setSelectedTab("Restake")}
          >
            Restake
          </Button>
          <Button
            w="25%"
            h="100%"
            bg={selectedTab === "Unstake" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "Unstake" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => {
              setValue('')
              setSelectedTab("Unstake")
            }}
          >
            Unstake
          </Button>
          <Button
            w="25%"
            h="100%"
            bg={selectedTab === "Withdraw" ? "blue.200" : "white.100"}
            _focus={{ bg: "#2a72e5", color: "white.100" }}
            color={selectedTab === "Withdraw" ? "white.100" : "gray.1000"}
            fontSize={"13px"}
            fontWeight={500}
            onClick={() => {
              setSelectedTab("Withdraw")
            }}
          >
            Withdraw
          </Button>
        </Flex>
      </Flex>
      <MobileStakingComponent 
        operatorList={candidateList.concat(noStakingRewardList)}
        title={selectedTab}
      />
    </Flex>
  );
}

export default MobileStaking;
