import { Flex, Text } from "@chakra-ui/react"
import CLOSE_ICON from "assets/images/popup-close-icon.svg";
import Image from "next/image";

export const ModalHeader = (args: {
  main: string,
  sub: string,
  closeThisModal: any,
}) => {
  const {main, sub, closeThisModal} = args;

  return (
    <Flex pos={'relative'} flexDir={'column'} alignItems={'center'}>
      <Flex
        pos={"absolute"}
        right={main === "Unstake" ? "-90px" :"-130px"}
        top={'-60px'}
        cursor={"pointer"}
        onClick={() => closeThisModal()}
      >
        <Image src={CLOSE_ICON} alt={"CLOSE_ICON"}></Image>
      </Flex>
      <Text
        color={"gray.800"}
        fontSize={'20px'}
        fontWeight={'bold'}
        h={"31px"}
        mt={'6px'}
      >
        {main}
      </Text>
      <Text
        color={"#86929d"}
        fontSize={'12px'}
        fontWeight={'normal'}
        mb={'20px'}
      >
        {sub}
      </Text>
    </Flex>
  )
}