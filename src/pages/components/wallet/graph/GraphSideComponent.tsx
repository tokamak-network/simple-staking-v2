import { Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';

type GraphSideComponentProps = {
  title: string;
  value: string;
}

export const GraphSideComponent: FC<GraphSideComponentProps> = ({
  title,
  value
}) => {
  return(
    <Flex 
      flexDir={'column'} 
      w={'100%'} 
      fontWeight={500}
      textAlign={'left'}
      fontSize={'16px'}
      mb={'25px'}
    >
      <Text
        h={'21px'}
        color={'#304156'}
      >
        {title}
      </Text>
      <Text
        mt={'5px'}
        color={'#808992'}
      >
        {value !== '' ? value : '0.00'}
      </Text>
    </Flex>
  )
}