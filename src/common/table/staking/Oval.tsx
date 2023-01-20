import {Avatar, Flex, Text, useColorMode} from '@chakra-ui/react';
import React from 'react';

type OperatorImageProps = {
  imageLink?: string;
};
export const OperatorImage: React.FC<OperatorImageProps> = (props) => {
  const {imageLink} = props;
  const {colorMode} = useColorMode();

  if (imageLink === '' || imageLink === undefined) {
    return (
      <Flex
        w={'48px'}
        h={'48px'}
        alignItems="center"
        justifyContent="center"
        border={'1px solid #f4f6f8' }
        borderRadius={25}
        fontSize={14}
        color={'#c7d1d8'}>
        <Text>OPR</Text>
      </Flex>
    );
  }
  return (
    <Avatar
      src={imageLink}
      backgroundColor={'transparent'}
      bg="transparent"
      color="#c7d1d8"
      name={'token_image'}
      border={'1px solid #c7d1d8'}
      borderRadius={25}
      h="48px"
      w="48px"
    />
  );
};

export default OperatorImage
