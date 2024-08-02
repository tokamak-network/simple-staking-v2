import { Flex, Text } from "@chakra-ui/react";

type BalanceDisplayProps = {
  tonBalance: string | undefined
  wtonBalance: string | undefined
}

export function BalanceDisplay (args: BalanceDisplayProps) {
  const { tonBalance, wtonBalance } = args

  return (
    <Flex alignItems={"center"} h="35px">
      <Text color="gray.300" fontSize={"12px"} mr={'5px'}>
        Balance:
      </Text>
      <Flex>
        <Text fontSize={"13px"} color="gray.700">
          {tonBalance} TON
        </Text>
        <Text 
          fontSize={"13px"} 
          color="gray.700"
          ml={'3px'}
        >
          {`/ ${wtonBalance}`} WTON
        </Text> 
      </Flex>
    </Flex>
  )
}