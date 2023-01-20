import { Flex, Text } from "@chakra-ui/react"
import { FC } from "react";

type OperatorDetailProps = {
  title: string; 
  value: string | number | undefined; 
  unit?: string; 
  type?: string
}

export const OperatorDetailInfo: FC<OperatorDetailProps> = ({
  title,
  value,
  unit,
  type
}) => {
  return (
    <Flex
      flexDir={'column'}
    >
      <Text 
        color={'#808992'}
        fontSize={'15px'} 
        mb={'12px'}
      >
        {title}
      </Text>
      <Flex flexDir={'row'} alignItems={type === 'date' ? 'start' : 'end'} h={'37px'}>
        <Text 
          fontSize={type === 'date' ? '16px' : '28px'}
          fontWeight={type === 'date' ? 500 : 'bold'}
          color={'#304156'}
        >
          {value}
        </Text>
        {unit? <Text fontSize={'13px'} fontWeight={500} ml={'6px'} mb={'5px'}>{unit}</Text> : ''}
      </Flex>
    </Flex>
  )
}

export default OperatorDetailInfo