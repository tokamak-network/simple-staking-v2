import { Flex, Text } from '@chakra-ui/react';
import CLOSE_ICON from 'assets/images/popup-close-icon.svg';
import Image from 'next/image';

export const ModalHeader = (args: { 
  main: string; 
  sub: string; 
  closeThisModal: any; 
  type?: number 
  sub2?: string;
}) => {
  const { main, sub, closeThisModal, type, sub2 } = args;
 
  return (
    <Flex pos={'relative'} flexDir={'column'} alignItems={'center'}>
      <Flex
        pos={'absolute'}
        right={
          main === 'Withdraw' && type === 3
          ? '-490px'
          : (main === 'Withdraw') && type === 2
          ? '-330px'
          : main === 'Withdraw' 
          ? '-160px'
          : type === 4
          ? '-180px'
          : main === 'Stake'
          ? '-110px'
          : '-110px'
        }
        top={'-60px'}
        cursor={'pointer'}
        onClick={() => closeThisModal()}
      >
        <Image src={CLOSE_ICON} alt={'CLOSE_ICON'}></Image>
      </Flex>
      <Text color={'#3d495d'} fontSize={'20px'} fontWeight={'bold'}  mt={'6px'} w={'200px'} textAlign={'center'}>
        {main}
      </Text>
      <Flex 
        color={type === 2 ? '#3d495d' : '#86929d'} 
        fontSize={'12px'} 
        fontWeight={'normal'} 
        mb={'20px'} 
        maxW={'290px'} 
        textAlign={'center'}
        flexDir={'row'}
      >
        <Text>
          {sub}
        </Text>
        {
          type === 2 ?
          <Text color={'#257eee'} ml={'2px'}>
            {sub2}
          </Text> : ''
        }
      </Flex>
    </Flex>
  );
};

export default ModalHeader;
