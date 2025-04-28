import { Flex, Image as ChakraImage, Text } from "@chakra-ui/react"
import Image from 'next/image'
import ETH_SYMBOL from "@/assets/images/ETH-symbol.svg"
import TITAN_SYMBOL from '@/assets/images/symbol.svg'
import Arrow from '@/assets/images/right_arrow.svg'

type WithdrawL2ImageProps = {
  l2Image: any
  l2Name: string
}

export const WithdrawL2Image = (args: WithdrawL2ImageProps) => {
  const { l2Image, l2Name } = args
  console.log(l2Image)
  return (
    <Flex
      h={'112px'}
      flexDir={'row'}
      justifyContent={'center'} 
      alignItems={'start'}
      fontSize={'12px'}
      fontWeight={'normal'}
      color={'#07070c'}
      mt={'30px'}
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
      <Flex mx={'15px'} mt={'10px'}>
        <Image src={Arrow} alt={''} />
      </Flex>
      <Flex flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
        <Flex 
          w={'40px'} 
          h={'40px'} 
          bgColor={'#383736'} 
          borderRadius={'100px'} 
          justifyContent={'center'} 
          alignItems={'center'}
        >
          {
            l2Image ?
            <ChakraImage src={l2Image} alt={'L2'} /> : 
            <Text color={'#fff'}>
              L2
            </Text>

          }
        </Flex>
        <Flex mt={'6px'} minW={'50px'} justifyContent={'center'}>
          {l2Name}
        </Flex>
      </Flex>
    </Flex>
  )
}