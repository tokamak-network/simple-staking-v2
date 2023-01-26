import { Box, Flex, Text, useTheme, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import useOperatorList from "@/hooks/staking/useOperatorList";
import OperatorCard from "./components/operators/OperatorCard";
function Operators() {
  const theme = useTheme();
  const { account } = useWeb3React();
  const { operatorList } = useOperatorList();

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
        Select your favorite operator
      </Text>
      <Text
        fontSize={"12px"}
        textAlign="center"
        mt="5px"
        mb="30px"
        w="250px"
        color={"gray.300"}
      >
        Select an operator to stake, unstake, or withdraw your tokens.
      </Text>
      <Flex w="100%" px="20px" flexDir={'column'}>
        {operatorList.map((operator:any, index:number) => {
            return (
                <OperatorCard operator={operator} key={index}/>
            )
           
        })}
      </Flex>
    </Flex>
  );
}

export default Operators;
