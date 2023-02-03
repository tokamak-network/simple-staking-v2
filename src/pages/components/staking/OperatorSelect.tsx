import {
  Button,
  Flex,
  Text,
  useTheme,
  NumberInput,
  NumberInputField,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import icon_close from "assets/images/icon_close.png";
import Image from "next/image";
import React, { SetStateAction, useEffect } from "react";
import OperatorImage from "@/common/table/staking/Oval";

function OperatorSelect(props: {
  operatorList: any;
  onClose: any;
  isOpen: any;
  setSelectedOp: React.Dispatch<SetStateAction<any>>;
}) {
  const { operatorList, onClose, isOpen, setSelectedOp } = props;

  return (
    <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent bg="white" height="45% !important" borderRadius={"8px"}>
        <DrawerHeader borderBottomWidth="1px">
          {" "}
          <Flex alignItems={"center"} justifyContent="space-between">
            <Text color={"black.300"} fontSize="16px" fontWeight={"normal"}>
              Select an operator
            </Text>
            <Flex h="24px" w="24px" onClick={onClose} ml={"15px"}>
              <Image src={icon_close} alt="icon_close" />
            </Flex>
          </Flex>
        </DrawerHeader>
        <DrawerBody pt="10px">
          {operatorList?.map((operator: any, index:number) => {            
            return (
              <Flex
                h="58px"
                alignItems={"center"}
                key={index}
                onClick={() => {
                  setSelectedOp(operator);
                  onClose();
                 
                }}
              >
                <OperatorImage height="30px" width="30px" />
                <Text
                  ml="15px"
                  fontSize={"16px"}
                  color="black.300"
                  fontWeight={500}
                >
                  {operator.name}
                </Text>
              </Flex>
            );
          })}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}


export default OperatorSelect;