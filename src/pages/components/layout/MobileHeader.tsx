import {
  Flex,
  CircularProgress,
  Box,
  Stack,
  Button,
  Text,
  useTheme,
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
import mobile_logo from "assets/images/mobile_logo.png";
import { useWeb3React } from "@web3-react/core";
import useModal from "@/hooks/useModal";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useRecoilValue } from "recoil";
import { txStatusState } from "@/atom/global/transaction";
import trimAddress from "@/utils/trimAddress";
import WalletModal from "@/common/modal/Wallet";
import Burger_icon from "assets/images/Burger_icon.png";
import { useRef, useState } from "react";
import Burger_close_icon from "assets/images/Burger_close_icon.png";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

type MenuLinksProps = {
  walletopen: () => void;
  account: string | undefined | null;
};

function MobileHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<any>([]);
  const { chainId, account } = useWeb3React();
  const { openModal } = useModal("wallet");
  const [isHover, setIsHover] = useState<number | undefined>(undefined);
  const router = useRouter();
  const { pathname } = router;
  const [width] = useWindowDimensions();
  const more = () => {

  }
  const navItemList = [
    // {
    //   name: "Home",
    //   link: "home",
    // },
    {
      name: "DAO Candidates",
      link: "operators",
    },
    {
      name: "Staking",
      link: "staking",
    },
    {
      name: "Account",
      link: "account",
    },
    {
      name: "More",
      link: ""
    }
  ];

  const navSubItemList = [
    {
      name: "User Guide",
      link: "https://docs.tokamak.network/home/service-guide/staking-and-dao/simple-staking"
    },
    {
      name: "Get Help",
      link: "https://docs.google.com/forms/d/16H_To1WJjIVvdS5h6Ng9rTi2EXZhwgz5Oz4IGOdfdwc/edit"
    }
  ]

  const MenuLinks: React.FC<MenuLinksProps> = ({ account, walletopen }) => {
    const theme = useTheme();
    const txPending = useRecoilValue(txStatusState);

    return (
      <Box
        display={{ base: "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
        >
          <Button
            border="solid 1px #d7d9df"
            color={
              // colorMode === 'dark'
              //   ? theme.colors.gray[0]
              //   : match?.isExact
              //   ? account
              //     ? theme.colors.gray[225]
              //     : 'white.100'
              //   : theme.colors.gray[175]
              "#86929d"
            }
            w={121}
            h={35}
            fontSize={14}
            fontWeight={600}
            onClick={walletopen}
            rounded={18}
            bg={
              // colorMode === 'dark'
              //   ? 'black.200'
              //   : match?.isExact
              //   ? account
              //     ? 'white.100'
              //     : 'blue.200'
              //   : 'transparent'
              txPending === true ? '#2a72e5' : "white.100"
            }
            zIndex={100}
            _hover={{}}
          >
            {account ? (
              txPending === true ? (
                <Text
                  fontFamily={theme.fonts.roboto}
                  fontWeight={'normal'}
                  fontSize={"14px"}
                  ml={"18px"}
                  pt={"1px"}
                  color={'#fff'}
                >
                  Tx PENDING
                </Text>
              ) : (
                <Flex
                  flexDir={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <span
                    style={{
                      marginRight: "5px",
                      top: "2px",
                      position: "relative",
                    }}
                  >
                    <Jazzicon
                      diameter={23}
                      seed={jsNumberForAddress(account)}
                    />
                  </span>
                  <Text textAlign={"left"} fontSize='13px'>
                    {trimAddress({
                      address: account,
                      firstChar: 4,
                      lastChar: 4,
                      dots: "....",
                    })}
                  </Text>
                </Flex>
              )
            ) : (
              "Connect wallet"
            )}
            {txPending === true ? (
              <CircularProgress
                isIndeterminate
                size={4}
                zIndex={100}
                color="blue.500"
                pos="absolute"
                left={"14px"}
              ></CircularProgress>
            ) : null}
          </Button>
        </Stack>
      </Box>
    );
  };

  return (
    <Flex
      h="80px"
      alignItems={"center"}
      justifyContent={"space-between"}
      width="100%"
      pl="20px"
      pr="10px"
    >
      <Link href={'home'}>
        <Image src={mobile_logo} alt={"mobile logo"} height={30} width={135} />
      </Link>
      <Flex height={"35px"} alignItems="center">
        <MenuLinks account={account} walletopen={openModal} />
        <Button
          height={30}
          bg="transparent"
          _focus={{
            bg: "transparent",
          }}
          _active={{
            bg: "transparent",
          }}
          p={0}
          ml="10px"
          ref={btnRef}
          onClick={onOpen}
        >
          <Image src={Burger_icon} alt={"Burger_icon"} height={30} width={30} />
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
          size={width && width < 460? "full":'md'}
        >
          <DrawerContent bg="white" padding="26px 10px 10px 20px">
            <Flex w="100%" justifyContent={"flex-end"}>
              <Button
                bg="transparent"
                _focus={{
                  bg: "transparent",
                }}
                _active={{
                  bg: "transparent",
                }}
                p={0}
                ml="10px"
                ref={btnRef}
                onClick={onClose}
              >
                <Image
                  src={Burger_close_icon}
                  alt={"Burger_icon"}
                  height={30}
                  width={30}
                />
              </Button>
            </Flex>

            <DrawerBody p="0">
              <Flex mt="24px" flexDir={"column"}>
                {navItemList.map((item: any, index: number) => {
                  return (
                    <Flex flexDir={'column'}>
                      <Link
                        href={`${item.link}`}
                        key={`nav-item-${index}`}
                        passHref
                        onClick={item.name === 'More' ? more : onClose}
                      >
                        <Flex
                          fontSize={"20px"}
                          fontWeight={600}
                          mb="30px"
                          color={
                            isHover === index
                              ? pathname === "/" + item.link
                                ? "#2a72e5"
                                : "#3e495c"
                              : pathname === "/" + item.link
                              ? "#2a72e5"
                              : "#3e495c"
                          }
                          cursor={"pointer"}
                          onMouseEnter={() => setIsHover(index)}
                          onMouseLeave={() => setIsHover(undefined)}
                        >
                          {item.name}
                        </Flex>
                      </Link>
                      {
                      item.name === "More" ?
                      <Flex
                        key={`nav-item-${index}`}
                        onClick={onClose}
                        flexDir={'column'}
                        ml={'20px'}
                      >
                        {navSubItemList.map((title: any, index: number) => {
                          return (
                            <Flex
                              fontSize={"16px"}
                              fontWeight={600}
                              mb="30px"
                              color={
                                isHover === index
                                  ? pathname === "/" + item.link
                                    ? "#2a72e5"
                                    : "#3e495c"
                                  : pathname === "/" + item.link
                                  ? "#2a72e5"
                                  : "#3e495c"
                              }
                              cursor={"pointer"}
                              onMouseEnter={() => setIsHover(index)}
                              onMouseLeave={() => setIsHover(undefined)}
                            >
                              <a 
                                target="_blank" 
                                href={`${title.link}`} 
                                rel="noopener noreferrer"
                              >
                                {title.name}
                              </a>
                            </Flex>
                          )
                        })}
                        
                        
                      </Flex>
                      :
                      ''
                      }
                      

                    </Flex>
                  );
                })}
              </Flex>
            </DrawerBody>

            {/* <DrawerFooter>
             
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </Flex>

      <WalletModal />
    </Flex>
  );
}

export default MobileHeader;
