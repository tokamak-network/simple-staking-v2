import OperatorImage from "@/common/table/staking/Oval";
import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import select1_arrow_inactive from "assets/images/select1_arrow_inactive.png";
import OperatorSelect from "../OperatorSelect";
import trimAddress from "@/components/trimAddress";

type SelectOperatorProps = {
  onOpen: any
  selectedOp: any
  operatorList: any
  setSelectedOp: any
}

export function SelectOperator (args: SelectOperatorProps) {
  const { selectedOp, operatorList, setSelectedOp } = args
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      mt="10px"
      h="40px"
      borderRadius={"4px"}
      border="solid 1px #dfe4ee"
      justifyContent={"space-between"}
      alignItems="center"
      px="10px"
      onClick={onOpen}
    >
      <Text fontSize={"12px"}>Select an operator</Text>
      <Flex alignItems={"center"}>
        {
          selectedOp ?
          <Flex>
            <OperatorImage height="20px" width="20px" />
            <Text ml="7px" fontSize={"13px"} fontWeight="bold">
              {
                selectedOp?.name.length > 12 ?
                trimAddress({
                  address: selectedOp?.name,
                  firstChar: 10,
                  lastChar: 0,
                  dots:'...'
                }) :
                selectedOp?.name
              }
            </Text>
          </Flex> : 
          <Flex color={'#3e495c'} fontSize={'13px'} fontWeight={'bold'}>
            Select one...
          </Flex>
        }
        <Flex height={"9px"} width={"8px"} ml="10px" >
          <Image
            src={select1_arrow_inactive}
            alt={"select1_arrow_inactive"}
          />
        </Flex>
      </Flex>
      <OperatorSelect
        operatorList={operatorList}
        onClose={onClose}
        isOpen={isOpen}
        setSelectedOp={setSelectedOp}
      />
    </Flex>
  )
}

export default SelectOperator