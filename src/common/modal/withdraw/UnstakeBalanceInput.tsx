import { BalanceInput } from "@/common/input/CustomInput"
import { Flex } from "@chakra-ui/react"
import Image from "next/image"
import TON from "@/assets/images/ton.svg"
import WTON from "@/assets/images/wton.svg"
import { UnstakableBalance } from "@/common/balance/UnstakableBalance"

type UnstakeBalanceInputProps = {
  stakedAmount: string | undefined
  tokenType?: string
}

export const UnstakeBalanceInput = (args: UnstakeBalanceInputProps) => {
  const { stakedAmount, tokenType } = args
  
  return (
    <Flex
      w={'320px'}
      h={'78px'}
      borderRadius={'10px'}
      border={'solid 1px #e8edf2'}
      flexDir={'column'}
    >
      <Flex mt={'15px'} ml={'14px'} w={'100%'}>
        <Flex justifyContent={'start'}>
          <Flex 
            w={'24px'} 
            h={'24px'} 
            border={'solid 1px #e8edf2'} 
            borderRadius={'100px'} 
            justifyContent={'center'} 
            alignItems={'center'}
            mr={'9px'}
            backgroundColor={tokenType ? tokenType === 'WTON' ? '#007aff' : '' : ''}
            p={tokenType ? tokenType === 'WTON' ? '#007aff' : '' : ''}
          >
            <Image src={tokenType ? tokenType === 'WTON' ? WTON : TON : TON} alt={''} />
          </Flex>
          <Flex
            fontSize={'18px'}
            fontWeight={500}
            color={'#07070c'}
            h={'24px'}
            alignItems={'center'}
          >
            {tokenType ? tokenType : 'TON'}
          </Flex>
        </Flex>
        <Flex>
          <BalanceInput
            w={tokenType ? tokenType === 'WTON' ? '82.5px' : '100px' : '100px'}
            h={'24px'}
            placeHolder={'0.00'}
            type={'unstaking'}
            maxValue={stakedAmount ? stakedAmount.replace(/\,/g,'') : '0.00'}
          />
        </Flex>
      </Flex>
      <UnstakableBalance 
        stakedAmount={stakedAmount}
        tokenType={tokenType}
        justify={'end'}
      />
    </Flex>
  )
}