import OperatorDetailInfo from "@/common/table/staking/OperatorDetail"
import { convertNumber } from "@/components/number"
import { Box, Flex } from "@chakra-ui/react"
import WalletInformation from "./WalletInformation"


export default function UserServiceBox (props : {
  original: any
}) {
  const { original } = props
  const {
    stakedUserList,
    pending,
    stakeOf,
    expectedSeig,
    candidateContract,
    candidateAmount
  } = original

  const minimumAmount = Number(candidateAmount) >= 1000

  const userExpectedSeig = expectedSeig ? 
    convertNumber({
      amount: expectedSeig,
      type: 'ray',
      localeString: true
    }) : '-' 
  
  const yourStake = convertNumber({
    amount: stakeOf, 
    type: 'ray',
    localeString: true
  })

  const pendingUnstaked = convertNumber({
    amount: pending,
    type: 'ray',
    localeString: true
  })

  return (
    <Flex flexDir={'row'} mt={'28px'}>   
      <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
        <OperatorDetailInfo 
          title={'Total Stakers'}
          value={stakedUserList.length}
        />
        <Flex mt={'40px'} />
        <OperatorDetailInfo 
          title={'Pending Withdrawal'}
          value={pendingUnstaked}
          unit={'TON'}
          type={''}
        />
      </Flex>
      <Box p={0} w={'390px'} borderRadius={'10px'} alignSelf={'flex-start'}>
        <WalletInformation 
          data={original}
        />
      </Box>
      <Flex flexDir={'column'} justifyContent={'start'} h={'100%'} mt={'30px'} w={'285px'} ml={'70px'}>
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <OperatorDetailInfo 
            title={'Your Staked'}
            value={yourStake}
            unit={'TON'}
            type={''}
          />
        </Flex>
        <Flex flexDir={'column'} alignItems={'space-between'} mt={'40px'}>
          <OperatorDetailInfo 
            title={'Unclaimed Staking Reward'}
            value={userExpectedSeig}
            unit={'TON'}
            type={''}
            contractInfo={candidateContract}
            minimumAmount={minimumAmount}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}