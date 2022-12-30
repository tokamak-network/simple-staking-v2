import { Flex } from "@chakra-ui/react";
import TopCard from "./TopCard";

function TopCardContainer () {
  return (
    <Flex flexDir={'row'} justifyContent={'space-between'} maxW={'1100px'}>
      <TopCard
        title={'Total Staked'}
        value={'100'}
      />
      <TopCard
        title={'Pending Withdrawal'}
        value={'1000'}
      />
      <TopCard
        title={'Total Accumulated Reward'}
        value={'100'}
      />
    </Flex>
  )
}

export default TopCardContainer