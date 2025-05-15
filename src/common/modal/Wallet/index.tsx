import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Flex,
  Link,
  useClipboard,
  Button,
  useToast,
} from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import trimAddress from '@/utils/trimAddress';
import { SUPPORTED_WALLETS } from '@/constants/index';
// import {isMobile} from 'react-device-detect';
import { WalletOption } from './Option';
import {   
  injected,
} from '@/connectors';
import { WalletPending } from './Pending';
import usePrevious from '@/hooks/usePrevious';
import { useEagerConnect, useInactiveListener } from '@/hooks/useWeb3';
import { useLocalStorage } from 'hooks/useStorage';
import { useRecoilValue } from 'recoil';
import { selectedModalState } from '@/atom/global/modal';
import useModal from '@/hooks/useModal';
import Image from 'next/image';
import copy from "copy-to-clipboard";
import ACCOUNT_COPY from '@/assets/images/account_copy_icon.png'
import ETHERSCAN_LINK from '@/assets/images/etherscan_link_icon.png'
import { REACT_APP_MODE, DEFAULT_NETWORK } from '@/constants/index';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

function WalletModal() {
  const { account, connector, activate, error, active, deactivate, chainId } = useWeb3React();
  const { onCopy } = useClipboard(account as string);
  // @ts-ignore
  const selectedModal = useRecoilValue(selectedModalState);
  const toast = useToast();
  const { closeModal } = useModal();
  // @ts-ignore
  const [copyText, setCopyText] = useState<string>('Copy Address');
  const [walletView, setWalletView] = useState<string>(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();
  const [pendingError, setPendingError] = useState<boolean>();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [chainSupported, setChainSupported] = useState<boolean>(true);

  const previousAccount = usePrevious(account);
  /* eslint-disable */
  const [accountValue, setAccountValue] = useLocalStorage('account', {});

  // const injected = injectedConnector(config?.SUPPORTED_CHAINID);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {
    if (account && !previousAccount) {
      closeModal();
    }
  }, [account, previousAccount]);

  // useEffect(() => {
  //   if (isOpen) {
  //     setPendingError(false);
  //     setWalletView(WALLET_VIEWS.ACCOUNT);
  //   }
  // }, [isOpen]);

  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error)) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [setWalletView, active, error, connector, activePrevious, connectorPrevious]);

  useEffect(() => {
    if (chainId === undefined) {
      return 
    }
    if (chainId !== Number(DEFAULT_NETWORK)) {
      setChainSupported(false)
    } else {
      setChainSupported(true)
    }
  }, [chainId])

  const handleWalletChange = useCallback(() => {
    setWalletView(WALLET_VIEWS.OPTIONS);
  }, []);

  const handleCopyAction = useCallback(() => {
    copy(account !== null && account ? account : "");
    toast({
      title: "Copied to Clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }, [copyText, onCopy]);

  const switchToDefaultNetwork = useCallback(async () => {
    if (!(window as any).ethereum) return;
    const hexChainId = '0x' + Number(DEFAULT_NETWORK).toString(16);
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      toast({ title: 'Switched network', status: 'success' });
    } catch (switchError: any) {
      // console.error('Failed to switch network', switchError);
      toast({ title: 'Failed to switch network', status: 'error' });
    }
  }, [toast]);

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name;
      }
      return true;
    });

    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);
    setAccountValue({ signIn: true });
    
    try {
      connector &&
        activate(connector, undefined, true).catch((error) => {
          if (
            // error instanceof UnsupportedChainIdError
            Number(DEFAULT_NETWORK) === chainId
          ) {
            try {
              // activate(connector); // a little janky...can't use setError because the connector isn't set
            } catch {
              // activate(trazorConnector);
            }
          } else {
            setPendingError(true);
          }
        });
    } catch {}
  };
  // console.log(chainId, DEFAULT_NETWORK)

  function formatConnectorName() {
    // @ts-ignore
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name: string = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === "METAMASK"))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return (
      <Flex flexDir={'row'}>
        <Text colorScheme="gray.200" fontSize="13px" mr={'10px'} mt={'2px'}>
          Connected with {name.toString()} 
        </Text>
        <Button 
          onClick={handleWalletChange} 
          w={'58px'} 
          h={'22px'} 
          bgColor={'#257eee'} 
          color={'#fff'} 
          fontWeight={600} 
          fontSize={'12px'} 
          outline="none" 
          variant="outline"
        >
          Change
        </Button>
      </Flex>
    );
  }

  const isTriedEager = useEagerConnect();
  useInactiveListener(!isTriedEager || !!activatingConnector);

  const getOptions = () => {
    let isMetamask: boolean = false;

    if (typeof window !== "undefined") {
      // @ts-ignore
      isMetamask = window?.ethereum?.isMetaMask;
    }

    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];

      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        // @ts-ignore
        if (
          typeof window !== "undefined" &&
          //@ts-ignore
          !(window?.web3 || window?.ethereum)
        ) {
          if (option.name === "MetaMask") {
            return (
              <WalletOption
                id={`connect-${key}`}
                key={key}
                color={"#E8831D"}
                header={"Install Metamask"}
                subheader={option.description}
                link={"https://metamask.io/"}
                icon={require("../../../assets/images/" + option.iconName).default}
                size={'20px'}
              />
            );
          } else {
            return null; //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === "MetaMask" && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === "Injected" && isMetamask) {
          return null;
        }
      }

      return (
        <WalletOption
          id={`connect-${key}`}
          onClick={() => {
            option.connector === connector
              ? setWalletView(WALLET_VIEWS.ACCOUNT)
              : !option.href && tryActivation(option.connector);
          }}
          key={key}
          active={option.connector === connector}
          color={option.color}
          link={option.href}
          header={option.name}
          subheader={option.description} //use option.descriptio to bring back multi-line
          icon={require("@/assets/images/" + option.iconName).default}
        />
      );
    });
  };
  
  return (
    <Modal 
      isOpen={selectedModal === 'wallet'} 
      onClose={closeModal}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      {walletView === WALLET_VIEWS.ACCOUNT && account ? (
        <ModalContent
          w={'280px'}
          px={'0px'}
          position={'absolute'}
          right={'45px'}
        >
          <ModalHeader
            fontFamily={'TitilliumWeb'}
          >
            <Text>
              Account
            </Text>
            <Text
              fontSize={'12px'}
              color={'#86929d'}
              fontWeight={'normal'}
            >
              My account & connect change
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} fontFamily={'TitilliumWeb'}>
            <Flex w={'280px'} borderY={'1px'} borderColor={'#f4f6f8'} ml={0}>
              {account && (
                <Flex my={'24px'} ml={'25px'}>
                  <Text fontSize="15px" fontWeight={600} mr={'12px'}>
                    {trimAddress({
                      address: account,
                      firstChar: 7,
                      lastChar: 4,
                      dots: '....',
                    })}
                  </Text>
                  <Flex w={'22px'} h={'22px'} mr={'7px'} onClick={handleCopyAction} cursor="pointer">
                    <Image src={ACCOUNT_COPY} alt={'alt'} />
                  </Flex>
                  <Link
                    isExternal
                    href={`https://etherscan.io/address/${account}`}
                    fontSize="sm"
                    _hover={{
                      textDecoration: 'none',
                    }}
                  >
                    <Image src={ETHERSCAN_LINK} alt={'alt'} />
                  </Link>
                </Flex>
              )}
            </Flex>
            <Flex w={'280px'} borderY={'1px'} borderColor={'#f4f6f8'} h={'50px'} justifyContent={'center'} alignItems={'center'}>
              {formatConnectorName()}
            </Flex>
            <Flex h={'64px'} justifyContent={'center'} alignItems={'center'}>
              <Flex 
                fontSize={'15px'} 
                color={'#2a72e5'} 
                fontWeight={600}
                cursor={'pointer'}
                onClick={() => {
                  deactivate();
                  closeModal();
                  setAccountValue({ signIn: false })
                }}
              >
                Logout
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      ) : !chainSupported ? (
        <ModalContent
          w={'280px'}
          px={'0px'}
          position={'absolute'}
          right={'45px'}
        >
          <ModalHeader>
            {Number(DEFAULT_NETWORK) !== chainId ? (
              <Flex
                h={'200px'}
                justifyContent={'end'}
                flexDir={'column'}
              >
                <Flex mb={'15px'}>
                  Network not supoorted.
                  <br />
                  {`Please change to ${REACT_APP_MODE === 'DEV' ? 'Sepolia' : 'Mainnet'}`}.
                </Flex>
                <Button
                  colorScheme="blue"
                  w="full"
                  mb={3}
                  onClick={switchToDefaultNetwork}
                >
                  Switch to {REACT_APP_MODE === 'DEV' ? 'Sepolia' : 'Mainnet'}
                </Button>

              </Flex>
            ) : (
              <Text>Error connecting</Text>
            )}
          </ModalHeader>
          <ModalCloseButton />
          {/* <ModalBody pb={6}>
            {error instanceof UnsupportedChainIdError ? (
              <Text>
                {networkLoading ? (
                  <Skeleton />
                ) : (
                  `App is running on ${network}. Please update your
                network configuration.`
                )}
              </Text>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ModalBody> */}
        </ModalContent>
      ) : (
        <ModalContent
          w={'280px'}
          px={'0px'}
          position={'absolute'}
          right={'45px'}
        >
          <ModalHeader
            fontFamily={'TitilliumWeb'}
          >
            <Text>
              Connect Wallet
            </Text>
            <Text
              fontSize={'12px'}
              color={'#86929d'}
              fontWeight={'normal'}
            >
              To start using Staking
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} fontFamily={'TitilliumWeb'} px={0}>
            {walletView === WALLET_VIEWS.PENDING ? (
              <WalletPending
                connector={pendingWallet}
                error={pendingError}
                setPendingError={setPendingError}
                tryActivation={tryActivation}
              />
            ) : (
              <>{getOptions()}</>
            )}
            {walletView !== WALLET_VIEWS.PENDING && (
              <Flex flexDir={'column'} fontSize={'13px'} fontFamily={'TitilliumWeb'} ml={'25px'}>
                <Text pt={3} >
                  New to Ethereum?{' '}
                </Text>
                <Link 
                  isExternal href="https://ethereum.org/wallets/"
                  color={'#2a72e5'}
                >
                  Learn more about wallets
                </Link>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
}

export default WalletModal;
