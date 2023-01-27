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
  import Image from "next/image";
  import useUserBalance from "@/hooks/useUserBalance";
  import { useWeb3React } from "@web3-react/core";
  import OperatorImage from "@/common/table/staking/Oval";
  import select1_arrow_inactive from "assets/images/select1_arrow_inactive.png";
  import icon_close from "assets/images/icon_close.png";
  import { useState } from "react";
  import OperatorSelect from "./OperatorSelect";

function MobileUnstakeComponent (props: { operatorList: any }) {
    const { account } = useWeb3React();
    const { operatorList } = props;
    const { userTonBalance } = useUserBalance(account);
    const theme = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedOp, setSelectedOp] = useState<any>(undefined);

    return (
        <Flex w="100%" px="20px">
      <Flex
        w="100%"
        h="205px"
        border={"1px solid #e7ebf2"}
        borderRadius="10px"
        pt="10px"
        pb="15px"
        px="20px"
        flexDir={"column"}
      >
        <Flex alignItems={"center"} h="35px">
          <Text color="gray.300" fontSize={"12px"}>
            Balance:
          </Text>
          <Text fontSize={"13px"} color="gray.700">
            TON
          </Text>
        </Flex>
        <Flex h="40px" justifyContent={"space-between"}>
          <Flex
            w="190px"
            border={"solid 1px #dfe4ee"}
            borderRadius="4px"
            h="40px"
            justifyContent={"flex-end"}
            alignItems="center"
            px="10px"
            fontSize={"13px"}
          >
            <NumberInput
              borderColor={"transparent"}
              _focus={{
                borderColor: "transparent",
              }}
              _active={{
                borderColor: "transparent",
              }}
              _hover={{
                borderColor: "transparent",
              }}
              focusBorderColor="transparent"
            >
              <NumberInputField
                textAlign={"right"}
                fontSize={"13px"}
                border="none"
                _focus={{
                  borderWidth: 0,
                }}
                pr="0px"
                _active={{
                  borderWidth: 0,
                }}
              ></NumberInputField>
            </NumberInput>
            <Text fontSize={"13px"} ml="7px">
              TON
            </Text>
          </Flex>
          <Button
            bg="transparent"
            border={"solid 1px #2a72e5"}
            fontSize="13px"
            h="40px"
            color={"blue.200"}
            _focus={{
              bg: "transparent",
            }}
            _active={{
              bg: "transparent",
            }}
            _hover={{
              bg: "transparent",
            }}
          >
            MAX
          </Button>
        </Flex>
        <Flex
          mt="10px"
          h="40px"
          borderRadius={"4px"}
          border="solid 1px #dfe4ee"
          justifyContent={"space-between"}
          alignItems="center"
          px="10px"
        >
          <Text fontSize={"12px"}>Select an operator</Text>
          <Flex alignItems={"center"}>
            <OperatorImage height="20px" width="20px" />
            <Text ml="7px" fontSize={"13px"} fontWeight="bold">
              {selectedOp !== undefined
                ? selectedOp?.name
                : operatorList[0]?.name}
            </Text>
            <Flex height={"9px"} width={"8px"} ml="10px" onClick={onOpen}>
              <Image
                src={select1_arrow_inactive}
                alt={"select1_arrow_inactive"}
              />
            </Flex>
          </Flex>
        </Flex>
        <Button
          mt="15px"
          bg="blue.200"
          color={"white.100"}
          _focus={{
            bg: "blue.200",
          }}
          _active={{
            bg: "blue.200",
          }}
          _hover={{
            bg: "blue.200",
          }}
        >
          Unstake
        </Button>
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

export default MobileUnstakeComponent