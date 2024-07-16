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
import React, { SetStateAction, useEffect, useState } from "react";
import { MobileToEthereum } from "./MobileToEthereum";
import { MobileToL2 } from "./MobileToL2";

type WithdrawDrawerProps = {
  onClose: any;
  isOpen: any;
  type: string;
  selectedOp: any
}

export function WithdrawDrawer (args: WithdrawDrawerProps) {
  const {onClose, isOpen, type, selectedOp} = args;

  return (
    <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent bg="white" height="85% !important" borderRadius={"8px"}>
        <DrawerHeader >
          {" "}
          <Flex w={'100%'} justifyContent={'space-between'}>
            <Text color={"#131315"} fontSize="16px" fontWeight={500}>
              Withdraw to {type}
            </Text>
            <Flex h="24px" w="24px" onClick={onClose} ml={"15px"}>
              <Image src={icon_close} alt="icon_close" />
            </Flex>
          </Flex>
        </DrawerHeader>
        <DrawerBody pt="10px">
          {
            type === 'Ethereum' ?
            <MobileToEthereum
              selectedOp={selectedOp}
              onClose={onClose}
            /> :
            <MobileToL2 
              selectedOp={selectedOp}
              onClose={onClose}
            />
          }
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}