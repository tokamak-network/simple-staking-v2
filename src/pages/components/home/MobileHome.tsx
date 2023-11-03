import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import Image from "next/image";
import Sub_Logo from 'assets/images/Sub_Logo.png'
import BalanceCard from "./BalanceCard";
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from "react";
import { convertNumber } from "utils/number";
import { useCandidateList } from '../../../hooks/staking/useCandidateList';

function MobileHome () {
const theme = useTheme();
const { account } = useWeb3React();

const { userTonBalance } = useUserBalance(account);
const { candidateList } = useCandidateList()
const [totalStaked, setTotalStaked] = useState('0')
const [expectedReward, setExpectedReward] = useState('0')

useEffect (() => {
  const ops = candidateList
  if (account) {
    const staked = ops.map((operator:any) => {
      const convert = convertNumber({
        amount: operator.stakeOf,
        type: 'ray'
      })
      return convert ? Number(convert) : 0
    })
    const sum = staked.reduce((partialSum, a) => partialSum + a, 0);
    
    setTotalStaked(sum.toLocaleString(undefined, {maximumFractionDigits:2 }))
    const seigs = ops.map((candidate: any) => {
      return candidate.expSeig
    })
    
    const expected = seigs.reduce((partialSum, a) => partialSum + a, 0)
    
    const convertedWTon = expected ? expected.toLocaleString(undefined, { maximumFractionDigits: 2}) : '0.00'
    convertedWTon && setExpectedReward(convertedWTon)    
  }
},[candidateList, expectedReward])

  return (
    <Flex 
      w='100%' 
      height={'100%'} 
      pt='40px' 
      alignItems={'center'} 
      flexDir='column'
    >
      <Image src={Sub_Logo}  alt='Sub_Logo' height={60} width={170}/>
      <Text 
        fontSize={'24px'} 
        fontWeight={'bold'} 
        mt='25px' 
        color='gray.700' 
        fontFamily={theme.fonts.roboto}
      >
        Tokamak Network
      </Text>
      <Text 
        fontSize={'12px'} 
        textAlign='center' 
        mt='5px' 
        mb='30px' 
        w='200px' 
        color={'gray.300'}
      >
        Stake your TON to earn rewards
      </Text>
      <BalanceCard 
        title={'Your TON Balance'} 
        amount={
          userTonBalance ?
          userTonBalance : 
          '0'
        } 
      />
      <BalanceCard 
        title={'Total Staked Amount'} 
        subTitle={'Expected Rewards'} 
        amount={totalStaked.toString()} 
        subAmount={expectedReward}
      />
    </Flex>
  )
}

export default MobileHome