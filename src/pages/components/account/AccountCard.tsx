import { Box, Flex, Text, useTheme, Button } from "@chakra-ui/react";

function AccountCard(props: { title: string; amount: string; symbol: string }) {
  const { title, amount, symbol } = props;
  return (
    <Flex
      w="100%"
      h={"70px"}
      bg="white.100"
      border={"1px solid #e7ebf2"}
      borderRadius="10px"
      px="15px"
      alignItems={"center"}
      mb='15px'
    >
      <Flex justifyContent={"space-between"} w="100%" alignItems={"center"}>
        <Text height={"100%"} fontSize="15px" color="gray.300">
        {title}
        </Text>
        <Flex flexDir={"column"}>
          <Text color="black.300" fontSize={"18px"} fontWeight="bold">
          {amount}
          </Text>
          <Text color="gray.300" fontSize={"10px"} textAlign="right">
            {symbol}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AccountCard;
