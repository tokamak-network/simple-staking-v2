import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { Checkbox, Flex } from "@chakra-ui/react"

type StakingCheckboxProps = {
  content: string
  handleCheckboxChange: any
}

export const StakingCheckbox = (args: StakingCheckboxProps) => {
  const { content, handleCheckboxChange } = args
  
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;

  return (
    <Flex w={mobile ? '100%' : ''} mt={mobile ? '24px' : ''}>
      <Checkbox 
        bgColor={'#fff'} 
        borderRadius={'4px'} 
        border={'solid 1px #e7ebf2'} 
        w={'18px'}
        h={'18px'}
        mt={'5px'}
        onChange={handleCheckboxChange}
      />
      <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={mobile ? '90%' : '271px'}>
        {content}
      </Flex>
    </Flex>
  )
}