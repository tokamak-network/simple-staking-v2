import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { Flex } from "@chakra-ui/react"
import Image, { StaticImageData } from 'next/image'


type WithdrawTypeProps = {
  name: string
  content: string
  onClick: any
  src: StaticImageData
}

export const WithdrawType = (args: WithdrawTypeProps) => {
  const { name, content, onClick, src } = args

  const [ width ] = useWindowDimensions();
  const mobile = width && width < 1040;
  
  return (
    <Flex
      w={ mobile ? '100%' : '300px' }
      h={ mobile ? '140px' : '253px' }
      flexDir={mobile ? 'row-reverse' : 'column'}
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
      mb={ mobile ? '12px' : '0px' }
      onClick={()=>onClick()}
    >
      <Flex flexDir={'column'} textAlign={mobile ? 'left' : 'center'} justifyContent={'center'}>
        <Flex
          fontSize={ mobile ? '17px' : '18px'}
          fontWeight={'bold'}
          color={'#3d495c'}
          flexDir={'column'}
        >
          {name}
        </Flex>
        <Flex
          mt={'12px'}
          mb={mobile ? '0px' : '25px'}
          fontSize={mobile ? '11px' : '12px'}
          color={'#86929d'}
          flexDir={'column'}
          w={mobile ? '230px' : '280px'}
        >
          {content}
        </Flex>
      </Flex>
      <Flex 
        w={mobile ? '60px' : '96px'} 
        h={mobile ? '60px' : '96px'}
        mr={mobile ? '12px' : ''}
      >
        <Image src={src} alt={''} />
      </Flex>
    </Flex>
  )
}