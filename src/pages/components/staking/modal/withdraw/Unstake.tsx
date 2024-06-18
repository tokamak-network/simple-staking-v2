import { BalanceInput } from "@/common/input/CustomInput"
import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TON from "@/assets/images/ton.svg"
import Image from "next/image"
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"

type UnstakeProps = {

}

export const Unstake = (args: UnstakeProps) => {
  const {} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  
  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
      <UnstakeBalanceInput />
      <Flex w={'100%'} h={'1px'} my={'25px'} bgColor={'#f4f6f8'} />
      <Flex>
        <Checkbox />
        <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={'271px'}>
          Donec quam lectus vel vulputate mauris. Nullam quam amet adipiscing quis diam nisl maecenas. Ornare fermentum ullamcorper ut ullamcorper amet. Amet et ut posuere.
        </Flex>
      </Flex>
      <Flex justifyContent={'center'}>
        <Button
          {...btnStyle.btnAble()}
          w={'130px'}
          h={'38px'}
          mt={'25px'}
          fontSize={'14px'}
          fontWeight={500}
        >
          Unstake
        </Button>
      </Flex>
    </Flex>
  )
}