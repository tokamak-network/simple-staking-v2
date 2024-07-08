import { Checkbox, Flex } from "@chakra-ui/react"

type StakingCheckboxProps = {
  content: string
  handleCheckboxChange: any
}

export const StakingCheckbox = (args: StakingCheckboxProps) => {
  const { content, handleCheckboxChange } = args
  return (
    <Flex>
      <Checkbox 
        bgColor={'#e9edf1'} 
        borderRadius={'4px'} 
        border={'solid 1px #e7ebf2'} 
        w={'18px'}
        h={'18px'}
        onChange={handleCheckboxChange}
      />
      <Flex ml={'10px'} fontSize={'12px'} fontWeight={'normal'} color={'#3e495c'} w={'271px'}>
        {content}
      </Flex>
    </Flex>
  )
}