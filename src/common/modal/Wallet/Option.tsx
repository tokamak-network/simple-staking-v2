import { Box, Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

type WalletOptionProps = {
  onClick?: () => void;
  id: string;
  active?: boolean;
  clickable?: boolean;
  color: string;
  link?: string | null;
  header: string;
  subheader: string | null;
  icon: string;
  size?: string;

};

export const WalletOption: FC<WalletOptionProps> = ({ onClick, id, header, subheader, icon, size }) => {
  return (
    <Flex id={id} onClick={onClick} cursor="pointer" borderY={'1px'} borderColor={'#f4f6f8'} px={5} py={3} h={'70px'} alignItems={'center'}>
      <Flex align="center">
        <Flex w={header === 'MetaMask' ? '25px' :'30px'} height={header === 'MetaMask' ? '25px' :'30px'} mr={'15px'}>
          <Image src={icon} alt={header} />
        </Flex>
        <Text fontSize="13px" fontFamily={'TitilliumWeb'} fontWeight={600}>{header}</Text>
      </Flex>
    </Flex>
  );
};
