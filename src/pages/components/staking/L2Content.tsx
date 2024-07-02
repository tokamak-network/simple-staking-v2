
import { Flex } from "@chakra-ui/react"
import trimAddress from '../../../utils/trimAddress';
import NEWTAB from '@/assets/images/newtab-icon.png'
import Image from "next/image";


type L2ContentProps = {
  title: string;
  content: string | undefined;
  type: string;
}

export const L2Content = (args: L2ContentProps) => {
  const {
    title,
    content,
    type
  } = args

  const convert = type === 'address' ? trimAddress({
    address: content ? content : '',
    firstChar: 6,
    lastChar: 4,
    dots: '...'
  }) : content

  return (
    <Flex
      flexDir={'column'}
      fontWeight={500}
      textAlign={'left'}
      w={'240px'}
    >
      <Flex
        fontSize={'13px'}
        color={'#808992'}
        mb={'8px'}
      >
        {title}
      </Flex>
      <Flex
        fontSize={type === 'link' ? '14px' : '20px'}
        color={'#304156'}
      >
        <Flex fontWeight={type === 'ton' ? 'bold' : 500}>
          {convert}
        </Flex>
        {
          type === 'ton' ?
          <Flex 
            fontSize={'13px'}
            fontWeight={500}
            ml={'4px'}
            alignItems={'end'}
            mb={'2px'}
          >
            TON
          </Flex> : ''
        }
        {
          type === 'address' || type === 'link' ?
          <Flex 
            width={'20px'} 
            height={'20px'} 
            justifyContent={'center'} 
            alignItems={'center'}
            ml={'6px'}
            mt={'5px'}
          >
            <Image src={NEWTAB} alt={''} /> 
          </Flex> : ''
        }
      </Flex>      
    </Flex>
  )
}