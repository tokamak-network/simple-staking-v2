import { Flex } from '@chakra-ui/react';
import TopCard from './TopCard';
import { FC } from 'react';

type TopCardContainerProps = {
  totalStaked: string | undefined
  pendingWithdrawal: string | undefined
  accumulatedReward: string | undefined
}

export const TopCardContainer: FC<TopCardContainerProps> = ({
  totalStaked,
  pendingWithdrawal,
  accumulatedReward,
}) => {
  
  return (
    <Flex flexDir={'row'} justifyContent={'space-between'} maxW={'1100px'} px={'200px'}>
      <TopCard
        title={'Total Staked'}
        value={totalStaked}
      />
      <TopCard
        title={'Pending Withdrawal'}
        value={pendingWithdrawal}
      />
      {/* <TopCard
        title={'Total Accumulated Reward'}
        value={accumulatedReward}
      /> */}
    </Flex>
  )
}

export default TopCardContainer