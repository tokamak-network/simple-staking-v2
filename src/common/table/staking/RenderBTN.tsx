import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export const renderBtn = (layer2: string, isOpen: string) => {
  if (isOpen === layer2)
    return (
      <Flex w={'100%'} justifyContent="flex-end" _hover={{cursor: 'pointer'}} ml={'90px'}>
        <TriangleUpIcon color="blue.100" _hover={{cursor: 'pointer'}} />
      </Flex>
    );
  return (
    <Flex
      w={'100%'}
      justifyContent="flex-end"
      // onClick={() => clickOpen(contractAddress, index)}
      _hover={{cursor: 'pointer'}}
      ml={'90px'}
    >
      <TriangleDownIcon
        color="blue.100"
        _hover={{cursor: 'pointer'}} 
      />
    </Flex>
  );
};


export default renderBtn
