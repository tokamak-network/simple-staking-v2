//@ts-ignore
import { Dot } from './dot';
import { Flex } from '@chakra-ui/react';

export const LoadingDots = () => {
  return (
    <Flex >
      <Dot>·</Dot>
      <Dot>·</Dot>
      <Dot>·</Dot>
      <Dot>·</Dot>
    </Flex>
  );
};
