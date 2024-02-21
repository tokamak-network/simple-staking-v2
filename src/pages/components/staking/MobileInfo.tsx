import { Flex } from "@chakra-ui/react";
import { convertNumber } from '../../../utils/number';

export default function MobileInfo(props: {
  title: string,
  value: string
}) {
  const { title, value } = props
  
  const convertedValue = 
    !value || value === '-' ?  
    '-' :
    convertNumber({
      amount: value,
      type:'ray'
    })

  return (
    <Flex
      h={'70px'}
      w={'100%'}
      mt={'15px'}
      borderRadius={'10px'}
      border={'solid 1px #e7ebf2'}
      bgColor={'#fff'}
      flexDir={'row'}
      alignItems={'center'}
      px={'20px'}
      justifyContent={'space-between'}
    >
      <Flex
        fontSize={'15px'}
        fontWeight={'normal'}
        color={'#86929d'}
      >
        {title}
      </Flex>
      <Flex
        flexDir={'column'}
        alignItems={'end'}
      >
        <Flex
          fontSize={'18px'}
          fontWeight={'bold'}
          color={'#131315'}
        >
          {convertedValue}
        </Flex>
        <Flex
          fontSize={'10px'}
          fontWeight={'normal'}
          textAlign={'right'}
          color={'#86929d'}
        >
          TON
        </Flex>
      </Flex>
    </Flex>
  )
}