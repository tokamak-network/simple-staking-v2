import { Box, Flex, Text, useTheme, Button, Spinner } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import OperatorCard from "./components/operators/OperatorCard";
import { useCandidateList } from '../hooks/staking/useCandidateList';

function Operators() {
  const theme = useTheme();
  const { candidateList, noStakingRewardList } = useCandidateList();

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
        Select Your Operator
      </Text>
      <Text
        fontSize={"12px"}
        textAlign="center"
        mt="5px"
        mb="30px"
        w="250px"
        color={"gray.300"}
      >
        Choose an operator to stake, restake, unstake, or withdraw TON (or WTON).
      </Text>
      <Flex w="100%" px="20px" flexDir={"column"}>
        <Flex mb={'15px'} fontSize={'18px'} fontWeight={'bold'} color={'#3e495c'} justifyContent={'center'}>
          Staking Reward Available
        </Flex>
        {candidateList.length !== 0 ? (
          candidateList.map((operator: any, index: number) => {
            return <OperatorCard operator={operator} key={index} />
          })
        ) : (
          <Flex justifyContent="center" alignItems={"center"} h='200px'>
            <Spinner size="md" emptyColor="gray.200" color="#2775ff" />
          </Flex>
        )}
        
        {
          noStakingRewardList.length !== 0 ? (
            noStakingRewardList.map((operator: any, index: number) => {
              console.log(index)
              return (
                <Flex flexDir={'column'}>
                  <Flex my={'15px'} fontSize={'18px'} fontWeight={'bold'} color={'#3e495c'} justifyContent={'center'}>
                    No Staking Reward Available
                  </Flex>
                  <OperatorCard operator={operator} key={index} />
                </Flex>
              )
            })
          ) : (
            <Flex />
          )
        }
      </Flex>
    </Flex>
  );
}

export default Operators;
