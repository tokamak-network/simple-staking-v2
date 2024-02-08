import { 
  Flex, 
  Text, 
  Button, 
  Stack, 
  Box, 
  useTheme, 
  CircularProgress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Center
} from '@chakra-ui/react';
import Image from 'next/image';
// import {NavLink, RouteMatch} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import trimAddress from '@/utils/trimAddress';
import { useState } from 'react';
import useModal from '@/hooks/useModal';
import WalletModal from '@/common/modal/Wallet/index';
import { useRouter } from "next/router";
import Link from "next/link";

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import TOKAMAK_ICON from '@/assets/images/tnss_bi.png';
import { useRecoilValue } from 'recoil';
import { txStatusState } from '@/atom/global/transaction';
import arrow from "assets/images/smallArrow.svg";

type MenuLinksProps = {
  walletopen: () => void;
  account: string | undefined | null;
};

const dropdownList = [
  {
    link: "support",
    name: "Support"
  },
  {
    link: "",
    name: "Get Help"
  }
]

const navItemList = [
  {
    link: "home",
    name: "Home"
  },
  {
    link: "staking",
    name: "Staking"
  },
  // {
  //   link: "stakingv2",
  //   name: "TON Staking v2"
  // },
  // {
  //   link: "fastwithdraw",
  //   name: "Tokamak Fast Withdraw"
  // },
  // {
  //   link: "wallet",
  //   name: "Wallet"
  // },
];

const NavItem = () => {
  const [isHover, setIsHover] = useState<number | undefined>(undefined);
  const router = useRouter();
  const { pathname } = router;
  
  return (
    <>
      {navItemList.map((item, index) => {
        const capitalLinkName = item.link.charAt(0).toUpperCase() + item.link.slice(1)
        return (
          <Link href={`${item.link}`} key={`nav-item-${index}`} passHref>
            <Flex
              alignItems="space-between"
              justifyContent={"center"}
              color={
                isHover === index
                  ? pathname === '/' + item.link
                    ? "#2a72e5"
                    : "#3e495c"
                  : pathname === '/' + item.link
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
        )
      })}
    </>
  )
}

const MenuLinks: React.FC<MenuLinksProps> = ({ account, walletopen }) => {
  const theme = useTheme();
  const txPending = useRecoilValue(txStatusState);

  return (
    <Box display={{ base:'none', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
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
            '#86929d'
          }
          w={151}
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
            'white.100'
          }
          zIndex={100}
          _hover={{}}
        >
          {account ? (
            txPending === true ? (
              <Text fontFamily={theme.fonts.roboto} fontWeight={100} fontSize={'14px'} ml={'18px'} pt={'1px'}>
                Tx PENDING
              </Text>
            ) : (
              <Flex flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                <span style={{ marginRight: '5px', top: '2px', position: 'relative' }}>
                  <Jazzicon diameter={23} seed={jsNumberForAddress(account)} />
                </span>
                <Text textAlign={'left'} fontWeight={'normal'}>
                  {trimAddress({
                    address: account,
                    firstChar: 7,
                    lastChar: 4,
                    dots: '....',
                  })}
                </Text>
              </Flex>
            )
          ) : (
            'Connect wallet'
          )}
          {txPending === true ? (
            <CircularProgress
              isIndeterminate
              size={4}
              zIndex={100}
              color="blue.500"
              pos="absolute"
              left={'14px'}
            />
          ) : null}
        </Button>
      </Stack>
    </Box>
  );
};

export const Header = () => {
  // const { pcView } = useMediaView();
  // const {  } = useActiveWeb3React();
  const { openModal } = useModal('wallet');
  // const theme = useTheme();
  const { account } = useWeb3React();
  const [menuState, setMenuState] = useState(false);
  const [hover, setHover] = useState(false);
  const handleMenuButtonhover = (event: any) => {
    event.preventDefault();
    setMenuState(true);
  };

  const handleMenuButtonClick = (event: any) => {
    event.preventDefault();

    !menuState && setMenuState(!menuState);
  };
  // /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  // const router = useRouter();
  // const { pathname } = router;


  return (
    <Flex
      w={'100%'}
      h={'84px'}
      justifyContent={['space-between', 'space-between', 'end']}
      alignItems={'center'}
      pr={[0, '11px', '35px']}
      // pt={'24px'}
      // pb={'20px'}
    >
      <Flex flexDir={'row'} w={'95%'} justifyContent="space-between">
        <Flex fontSize={'27px'} fontWeight={900}>
          <Image src={TOKAMAK_ICON} alt="" />
        </Flex>
        <Flex 
          fontSize={'18px'} 
          fontWeight={'bold'} 
          justifyContent="space-between" 
          alignItems={'center'} 
          w={'340px'} 
          mr={'10%'}
        >
          <NavItem/>
          <Menu 
            onClose={() => {
              setMenuState(false);
            }}
            isOpen={menuState}
          >
            <MenuButton
              as={Center}
              fontSize={'18px'}
              cursor={"pointer"}
              onMouseEnter={handleMenuButtonhover}
              // onMouseLeave={()=> setHoverOn(false)}
              onMouseDown={handleMenuButtonClick}
              borderBottom={menuState ? "none" : ""}
              onClick={handleMenuButtonClick}
              display={"flex"}
              flexDir={"row"}
            >
              <Flex>
                <Text>More</Text>
                <Flex
                  marginLeft={"4px"}
                  height={"24px"}
                  // width={"24px"}
                  transform={menuState === true ? "rotate(180deg)" : ""}
                >
                  <Image src={arrow} alt="icon_arrow" />
                </Flex>
              </Flex>
            </MenuButton>
            <MenuList
              onMouseLeave={() => setMenuState(false)}
              bg="#fff"
              mt={"17px"}
              border={"none"}
              fontSize={'13px'}
              fontWeight={'normal'}
              color={'#7a7e87'}
              boxShadow={'0 1px 4px 0 rgba(96, 97, 112, 0.14)'}
              style={{
                minWidth: "117px",
                paddingTop: "16px",
                paddingBottom: "6px",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <MenuItem
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                // target="_blank"
                as={"a"}
                href={"support"}
                h={"18px"}
                marginBottom={"16px"}
                padding={"0px"}
                // border={'1px solid red'}
                bg="#fff"
                _focus={{ background: "0F0F12" }}
                _hover={{ bg: "none", color: "#2a72e5" }}
              >
                <Text>
                  Support
                </Text>
              </MenuItem>
              <MenuItem
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                target="_blank"
                as={"a"}
                href={"https://docs.google.com/forms/d/16H_To1WJjIVvdS5h6Ng9rTi2EXZhwgz5Oz4IGOdfdwc/edit"}
                h={"18px"}
                marginBottom={"16px"}
                padding={"0px"}
                // border={'1px solid red'}
                bg="#fff"
                _focus={{ background: "0F0F12" }}
                _hover={{ bg: "none", color: "#2a72e5" }}
              >
                <Text>
                  Get Help
                </Text>
              </MenuItem>
            </MenuList>

          </Menu>
        </Flex>
        <Flex>
          <MenuLinks account={account} walletopen={openModal} />
        </Flex>
      </Flex>
      <WalletModal />
      {/* <WalletModalTest /> */}
    </Flex>
  );
};

export default Header;
