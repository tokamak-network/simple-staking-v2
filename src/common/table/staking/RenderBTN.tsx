import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

type renderBtnProps = {
  layer2: string
  isOpen: string
}

export const RenderBtn = (args: renderBtnProps) => {
  const { layer2, isOpen } = args

  if (isOpen === layer2)
    return (
      <Flex justifyContent="flex-end" _hover={{cursor: 'pointer'}} mr={'30px'}>
        <TriangleUpIcon color="blue.100" _hover={{cursor: 'pointer'}} />
      </Flex>
    );
  return (
    <Flex
      justifyContent="flex-end"
      // onClick={() => clickOpen(contractAddress, index)}
      _hover={{cursor: 'pointer'}}
      mr={'30px'}
    >
      <TriangleDownIcon
        color="blue.100"
        _hover={{cursor: 'pointer'}} 
      />
    </Flex>
  );
};


export default RenderBtn
