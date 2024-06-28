import NEWTAB from "@/assets/images/newtab-icon.png"
import trimAddress from "@/components/trimAddress"
import { Flex,Link } from "@chakra-ui/react"
import Image from "next/image"
import { ETHERSCAN_LINK } from "@/constants"

type L1ContractInfoType = {
  title: string
  content: string
}

export const L1ContractInfo = (props: L1ContractInfoType) => {
  const {title, content} = props
  return (
    <Flex 
      h={'70px'}
      w={'130px'}
      justifyContent={'center'}
      flexDir={'column'}
      py={'15px'}
    >
      <Flex
        fontSize={'12px'}
        fontWeight={'normal'}
        color={'#86929d'}
        mb={'3px'}  
      >
        {title}
      </Flex>
      <Flex justifyContent={'space-between'}>
        <Flex
          fontSize={'16px'}
          fontWeight={500}
          color={'#3d495c'}
        >
          {trimAddress({
              address: content,
              firstChar: 6,
              lastChar: 4,
              dots: '...'
            })}
        </Flex>
        <Link 
          w={'20px'} 
          h={'20px'} 
          mt={'2px'} 
          cursor={'pointer'}
          href={`${ETHERSCAN_LINK}/address/${content}`}
          isExternal
        >
          <Image src={NEWTAB} alt={''} />
        </Link>
      </Flex>
    </Flex>
  )
}
