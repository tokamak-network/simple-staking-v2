import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

type TopCardProps = {
  title: string;
  value: string | undefined;
}

export const TopCard: FC<TopCardProps> = ({
  title,
  value
 }) => {
  return (
    <Flex 
      flexDir={'column'}
      w={'256px'}
      h={'84px'}
      paddingY={'15px'}
      bg={'#fff'}
      borderRadius={'10px'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Text
        h={'18px'}
        fontSize={'13px'}
        fontWeight={500}
        color={'#808992'}
        mb={'7px'}
      >
        {title}
      </Text>
      <Flex flexDir={'row'} alignItems={'flex-end'}>
        <Text
          h={'26px'}
          fontSize={'20px'}
          fontWeight={500}
          color={'#304156'}
          mr={'5px'}
        >
          {value ? value : '0.00'}
        </Text>
        <Text
          h={'16px'}
          fontSize={'12px'}
          fontWeight={500}
          color={'#3d495d'}
        >
          TON
        </Text>
      </Flex>
    </Flex>
  )
}

export default TopCard