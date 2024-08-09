import { BalanceInput } from "@/common/input/CustomInput"
import { Flex } from "@chakra-ui/react"
import Image from "next/image"
import TON from "@/assets/images/ton.svg"
import { UnstakableBalance } from "@/common/balance/UnstakableBalance"

type UnstakeBalanceInputProps = {
  stakedAmount: string | undefined
}

export const UnstakeBalanceInput = (args: UnstakeBalanceInputProps) => {
  const {stakedAmount} = args
  
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
          >
            <Image src={TON} alt={''} />
          </Flex>
          <Flex
            fontSize={'18px'}
            fontWeight={500}
            color={'#07070c'}
            h={'24px'}
            alignItems={'center'}
          >
            TON
          </Flex>
        </Flex>
        <Flex>
          <BalanceInput
            w={'100px'}
            h={'24px'}
            placeHolder={'0.00'}
            type={'unstaking'}
            maxValue={stakedAmount ? stakedAmount.replace(/\,/g,'') : '0.00'}
          />
        </Flex>
      </Flex>
      <UnstakableBalance 
        stakedAmount={stakedAmount}
        justify={'end'}
      />
    </Flex>
  )
}