import { Flex } from "@chakra-ui/react";

export function MobileInfo(props: {
  title: string,
  value: string | number
}) {
  const { title, value } = props
  return (
    <Flex
      h={'70px'}
      w={'100%'}
      my={'15px'}
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
          {value}
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