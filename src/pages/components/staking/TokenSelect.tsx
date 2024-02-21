import {
  Flex,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import icon_close from "assets/images/icon_close.png";
import Image from "next/image";
import React, { SetStateAction, useEffect } from "react";

function TokenSelect(props: {
  tokenList: any;
  onClose: any;
  isOpen: any;
  setSelectedToken: React.Dispatch<SetStateAction<any>>;
}) {
  const { tokenList, onClose, isOpen, setSelectedToken } = props;

  return (
    <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent bg="white" height="30% !important" borderRadius={"8px"}>
        <DrawerHeader borderBottomWidth="1px">
          {" "}
          <Flex alignItems={"center"} justifyContent="space-between">
            <Text color={"black.300"} fontSize="16px" fontWeight={"normal"}>
              Select the token for staking
            </Text>
            <Flex h="24px" w="24px" onClick={onClose} ml={"15px"}>
              <Image src={icon_close} alt="icon_close" />
            </Flex>
          </Flex>
        </DrawerHeader>
        <DrawerBody pt="10px">
          {tokenList?.map((token: any, index:number) => {            
            return (
              <Flex
                h="58px"
                alignItems={"center"}
                key={index}
                onClick={() => {
                  setSelectedToken(token);
                  onClose();
                 
                }}
              >
                <Flex flexDir={'row'} alignItems={'space-between'} w={'100%'}>
                  <Text
                    ml="15px"
                    fontSize={"16px"}
                    color="black.300"
                    fontWeight={500}
                  >
                    {token}
                  </Text>
                </Flex>
                
              </Flex>
            );
          })}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default TokenSelect;