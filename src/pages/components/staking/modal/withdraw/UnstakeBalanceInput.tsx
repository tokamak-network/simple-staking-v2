import { BalanceInput } from "@/common/input/CustomInput"
import { Flex } from "@chakra-ui/react"
import Image from "next/image"
import TON from "@/assets/images/ton.svg"

type UnstakeBalanceInputProps = {
  stakedAmount: string
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
        <Flex justifyContent={'space-between'}>
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
            maxValue={stakedAmount.replace(/\,/g,'')}
          />
        </Flex>
      </Flex>
      <Flex 
        flexDir={'row'} 
        fontSize={'12px'} 
        fontWeight={'normal'} 
        color={'#7e7e8f'} 
        mt={'8px'} 
        justifyContent={'end'}
        mr={'20px'}
      >
        <Flex>
          Balance: {stakedAmount} TON 
        </Flex>
        <Flex mx={'3px'}>
          /
        </Flex>
        <Flex>
          $0.00
        </Flex>
      </Flex>
    </Flex>
  )
}