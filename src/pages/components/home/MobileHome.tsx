import { Box, Flex, Text, useMediaQuery, useTheme } from "@chakra-ui/react";
import Image from "next/image";
import Sub_Logo from 'assets/images/Sub_Logo.png'
import BalanceCard from "./BalanceCard";
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import useOperatorList from "@/hooks/staking/useOperatorList";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { convertNumber } from "utils/number";

function MobileHome () {
const theme = useTheme();
const {account} = useWeb3React();

const { userTonBalance } = useUserBalance(account);
const { operatorList } = useOperatorList()
const [totalStaked, setTotalStaked] = useState(0)
const [expectedReward, setExpectedReward] = useState('0')

useEffect (() => {
    const ops = operatorList
    const staked = ops.map((operator:any) => {
        return Number(operator.yourStaked.replaceAll (',',''))
    })

    const sum = staked.reduce((partialSum, a) => partialSum + a, 0);
    setTotalStaked(sum)

    const initialAmount = new BigNumber("0");
    const reducer = (amount:any, operator:any) => amount.plus(new BigNumber(operator.userSeigs))
    const expected = operatorList.reduce(reducer, initialAmount)
   
    const convertedWTon = convertNumber({
        type: "ray",
        amount: expected.toString(),
        localeString: true,
      });
      convertedWTon && setExpectedReward(convertedWTon)
      
    
},[operatorList])
  return (
    <Flex w='100%' height={'100%'} pt='40px' alignItems={'center'} flexDir='column'>
        <Image src={Sub_Logo}  alt='Sub_Logo' height={60} width={170}/>
        <Text fontSize={'24px'} fontWeight={'bold'} mt='25px' color='gray.700' fontFamily={theme.fonts.roboto}>Tokamak Network</Text>
        <Text fontSize={'12px'} textAlign='center' mt='5px' mb='30px' w='200px' color={'gray.300'}>Stake your TON to earn Power TON and other rewards</Text>
        <BalanceCard title={'Your TON Balance'} amount={userTonBalance?userTonBalance.slice(0,-3) :'0'} />
        <BalanceCard title={'Total Staked Amount'} subTitle={'Expected Rewards'} amount={totalStaked.toLocaleString()} subAmount={expectedReward}/>
    </Flex>
  )
}

export default MobileHome