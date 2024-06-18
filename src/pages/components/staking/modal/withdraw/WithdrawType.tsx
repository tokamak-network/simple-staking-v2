import { Flex } from "@chakra-ui/react"
import Image, { StaticImageData } from 'next/image'


type WithdrawTypeProps = {
  name: string
  content: string
  onClick: any
  src: StaticImageData
}

export const WithdrawType = (args: WithdrawTypeProps) => {
  const { name, content, onClick,src } = args
  return (
    <Flex
      w={'300px'}
      h={'253px'}
      flexDir={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={'15px'}
      cursor={'pointer'}
      boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
      textAlign={'center'}
      _hover={{
        border: "solid 1px rbga(31, 142, 250, 0.5)",
        boxShadow: "0 2px 6px 0 rgba(31, 142, 250, 0.25)"
      }}
      onClick={()=>onClick()}
    >
      <Flex
        fontSize={'18px'}
        fontWeight={'bold'}
        color={'#3d495c'}
        flexDir={'column'}
      >
        {name}
      </Flex>
      <Flex
        mt={'12px'}
        mb={'25px'}
        fontSize={'12px'}
        color={'#86929d'}
        flexDir={'column'}
        w={'280px'}
      >
        {content}
      </Flex>
      <Flex w={'96px'} h={'96px'}>
        <Image src={src} alt={''} />
      </Flex>
    </Flex>
  )
}