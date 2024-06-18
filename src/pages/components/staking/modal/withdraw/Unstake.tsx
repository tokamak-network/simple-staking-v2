import { BalanceInput } from "@/common/input/CustomInput"
import { Button, Checkbox, Flex, useTheme } from "@chakra-ui/react"
import TON from "@/assets/images/ton.svg"
import Image from "next/image"

type UnstakeProps = {

}

export const Unstake = (args: UnstakeProps) => {
  const {} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  
  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
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
              maxValue={'1000'}
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
            Balance: 0.00 TON 
          </Flex>
          <Flex mx={'3px'}>
            /
          </Flex>
          <Flex>
            $0.00
          </Flex>

        </Flex>
      
    </Flex>
    <Flex w={'100%'} h={'1px'} my={'25px'} bgColor={'#f4f6f8'} />
    <Flex>
      <Checkbox iconColor='blue.400'  />
      <Flex fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={'271px'}>
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