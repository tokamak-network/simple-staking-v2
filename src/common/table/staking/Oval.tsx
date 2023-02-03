import {Avatar, Flex, Text, useColorMode} from '@chakra-ui/react';
import React from 'react';

type OperatorImageProps = {
  imageLink?: string;
  height?:string,
  width?:string
};
export const OperatorImage: React.FC<OperatorImageProps> = (props) => {
  const {imageLink,height,width} = props;
  const {colorMode} = useColorMode();

  if (imageLink === '' || imageLink === undefined) {
    return (
      <Flex
        w={width?width:'48px'}
        h={height?height:'48px'}
        alignItems="center"
        justifyContent="center"
        border={'1px solid #f4f6f8' }
        borderRadius={25}
        fontSize={height && width? 8:14}
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
      h={height?height:"48px"}
      w={width?width:"48px"}
    />
  );
};

export default OperatorImage
