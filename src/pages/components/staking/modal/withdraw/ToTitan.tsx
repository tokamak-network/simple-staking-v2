import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import ETH_SYMBOL from "@/assets/images/ETH-symbol.svg"
import TITAN_SYMBOL from '@/assets/images/symbol.svg'
import Arrow from '@/assets/images/right_arrow.svg'
import Image from "next/image"
import { UnstakeBalanceInput } from "./UnstakeBalanceInput"

type ToTitanProps = {
  
}

export const ToTitan = (args: ToTitanProps) => {
  const theme = useTheme();
  const { btnStyle } = theme;
  
  return (
    <Flex flexDir={'column'}>
      <Flex
        h={'134px'}
        flexDir={'row'}
        justifyContent={'center'} 
        alignItems={'center'}
        fontSize={'12px'}
        fontWeight={'normal'}
        color={'#07070c'}
      >
        <Flex flexDir={'column'} alignItems={'center'}>
          <Flex 
            w={'40px'} 
            h={'40px'} 
            bgColor={'#383736'} 
            borderRadius={'100px'} 
            justifyContent={'center'} 
            alignItems={'center'}
          >
            <Image src={ETH_SYMBOL} alt={''} />
          </Flex>
          <Flex mt={'6px'}>
            Ethereum
          </Flex>
        </Flex>
        <Flex mx={'15px'} mb={'25px'}>
          <Image src={Arrow} alt={''} />
        </Flex>
        <Flex flexDir={'column'} alignItems={'center'}>
          <Flex 
            w={'40px'} 
            h={'40px'} 
            bgColor={'#383736'} 
            borderRadius={'100px'} 
            justifyContent={'center'} 
            alignItems={'center'}
          >
            <Image src={TITAN_SYMBOL} alt={''} />
          </Flex>
          <Flex mt={'6px'}>
            TITAN
          </Flex>
        </Flex>
      </Flex>
      <UnstakeBalanceInput 
        stakedAmount={'1000'}
      />
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
          Withdraw
        </Button>
      </Flex>
    </Flex>
  )
}