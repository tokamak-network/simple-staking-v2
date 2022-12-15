import { Flex, Text, Button, Stack, Box, useTheme, CircularProgress } from '@chakra-ui/react';
import Image from 'next/image';
// import {NavLink, RouteMatch} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import trimAddress from '@/utils/trimAddress';
import { useEffect, useState } from 'react';
import useModal from '@/hooks/useModal';
import WalletModal from '@/common/modal/Wallet/index';
import EthereumNetwork from '@/assets/images/ethereum-network.svg';
// import RinkebyNetwork from '@/assets/svgs/rinkeby-network.svg';
// import etcNetwork from '@/assets/svgs/undefined-symbol.svg';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import TOKAMAK_ICON from '@/assets/images/tnss_bi.png';
// import { findNetwork } from '@/utils/find';
// import { useConfig } from '@/hooks/useConfig';
import { useRecoilValue } from 'recoil';
import { txStatusState } from '@/atom/global/transaction';

type MenuLinksProps = {
  walletopen: () => void;
  account: string | undefined | null;
  isOpen: boolean;
};

const MenuLinks: React.FC<MenuLinksProps> = ({ isOpen, account, walletopen }) => {
  // const {colorMode} = useColorMode();
  const theme = useTheme();
  // const match = RouteMatch('/');
  // const {tx} = useAppSelector(selectTxType);
  // console.log('wallet')
  const txPending = useRecoilValue(txStatusState);

  return (
    <Box display={{ base: isOpen ? 'block' : 'none', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
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
            'gray.100'
          }
          w={151}
          h={35}
          fontSize={14}
          fontWeight={100}
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
                <Text textAlign={'left'}>
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
            ></CircularProgress>
          ) : null}
        </Button>
      </Stack>
    </Box>
  );
};

export const Header = () => {
  // const { pcView } = useMediaView();
  // const {  } = useActiveWeb3React();
  const { openModal } = useModal('wallet_modal');
  const theme = useTheme();
  const { chainId, account } = useWeb3React();
  const [currentNetwork, setCurrentNetwork] = useState('');
  // /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [isOpen, setIsOpen] = useState(false);
  // const { config } = useConfig();

  // useEffect(() => {
  //   const network = findNetwork(config, chainId);
  //   if (network) setCurrentNetwork(network.name);
  // }, [chainId, config]);

  return (
    <Flex
      w={'100%'}
      justifyContent={['space-between', 'space-between', 'end']}
      pr={[0, '11px', '35px']}
      pt={'24px'}
      pb={'20px'}
      // px={'146px'}
    >
      <Flex flexDir={'row'} w={'95%'} justifyContent="space-between">
        <Flex fontSize={'27px'} fontWeight={900}>
          <Image src={TOKAMAK_ICON} alt="" />
        </Flex>
        <Flex fontSize={'21px'} alignItems="center">
          
        </Flex>
        <Flex>
          <Flex w={'175px'} {...theme.HEADER_BUTTON_STYLE} mr={'15px'}>
            <span style={{ paddingTop: '2px', marginRight: '10px' }}>
              <Image
                src={EthereumNetwork}
                alt={''}
                // w={"12px"}
                // h={'12px'}
              />
            </span>
            <Text textAlign={'left'} fontSize={'14px'}>
              {currentNetwork && account ? currentNetwork : 'Not Logged In'}
            </Text>
          </Flex>
          {/* <Flex
            w={"177px"}
            // h={"48px"}
            {...theme.HEADER_BUTTON_STYLE}
            cursor={"pointer"}
            onClick={() => (account ? null : activate(injected))}
          > */}
          {/* <Image
              src={account ? WALLET_ICON : WALLET_INACTIVE_ICON}
              alt={"WALLET_ICON"}
            ></Image> */}
          {/* <Text w={"127px"} color={account ? "gray.200" : "#707070"}>
              {account
                ? trimAddress({
                    aaddress: account,
                    firstChar: 7,
                    lastChar: 4,
                    dots: "....",
                  })
                : "Connet Wallet"}
            </Text> */}
          <MenuLinks isOpen={isOpen} account={account} walletopen={openModal} />
        </Flex>
        {/* </Flex> */}
        {/* <Flex
          ml={"20px"}
          w={"48px"}
          h={"48px"}
          borderWidth={1}
          borderColor={"gray.300"}
          borderRadius={8}
          alignItems="center"
          justifyContent={"center"}
          cursor={"pointer"}
        >
          <Image src={MOON_ICON} alt={"MOON_ICON"}></Image>
        </Flex> */}
      </Flex>
      <WalletModal />
      {/* <WalletModalTest /> */}
    </Flex>
  );
};

export default Header;
