import { Flex, Text, Button, Stack, Box, useTheme, CircularProgress } from '@chakra-ui/react';
import Image from 'next/image';
// import {NavLink, RouteMatch} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import trimAddress from '@/utils/trimAddress';
import { useEffect, useState } from 'react';
import useModal from '@/hooks/useModal';
import WalletModal from '@/common/modal/Wallet/index';
import { useRouter } from "next/router";
import Link from "next/link";

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import TOKAMAK_ICON from '@/assets/images/tnss_bi.png';
import { useRecoilValue } from 'recoil';
import { txStatusState } from '@/atom/global/transaction';

type MenuLinksProps = {
  walletopen: () => void;
  account: string | undefined | null;
};

const navItemList = [
  {
    link: "home",
  },
  {
    link: "staking",
  },
  {
    link: "wallet",
  },
  {
    link: "support",
  },
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
              {capitalLinkName}
            </Flex>
          </Link>
        )
      })}
    </>
  )
}

const MenuLinks: React.FC<MenuLinksProps> = ({ account, walletopen }) => {
  // const {colorMode} = useColorMode();
  const theme = useTheme();
  // const match = RouteMatch('/');
  // const {tx} = useAppSelector(selectTxType);
  // console.log('wallet')
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
  const theme = useTheme();
  const { chainId, account } = useWeb3React();
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
        <Flex fontSize={'18px'} fontWeight={'bold'} justifyContent="space-between" alignItems={'center'} w={'540px'} mr={'250px'}>
          <NavItem/>
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
