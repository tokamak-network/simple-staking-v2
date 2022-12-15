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
// import {selectExplorerLink, selectNetwork} from 'store/app/app.reducer';
// import {useAppSelector} from 'hooks/useRedux';
import { useLocalStorage } from 'hooks/useStorage';
// import store from 'store'
// import {fetchUserInfo} from 'store/app/user.reducer';
import { useRecoilValue } from 'recoil';
import { selectedModalState } from '@/atom/global/modal';
import useModal from '@/hooks/useModal';
// import { useConfig } from '@/hooks/useConfig';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

function WalletModal() {
  const { account, connector, activate, error, active, deactivate } = useWeb3React();
  const { onCopy } = useClipboard(account as string);
  // @ts-ignore
  const selectedModal = useRecoilValue(selectedModalState);
  const { closeModal } = useModal();
  // const { config } = useConfig();
  // @ts-ignore
  const [copyText, setCopyText] = useState<string>('Copy Address');
  const [walletView, setWalletView] = useState<string>(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();
  const [pendingError, setPendingError] = useState<boolean>();
  const [activatingConnector, setActivatingConnector] = useState<any>();

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
  }, [account, previousAccount, closeModal]);

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

  const handleWalletChange = useCallback(() => {
    setWalletView(WALLET_VIEWS.OPTIONS);
  }, []);

  const handleCopyAction = useCallback(() => {
    onCopy();
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText(copyText);
    }, 1000);
  }, [copyText, onCopy]);

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
          if (error instanceof UnsupportedChainIdError) {
            try {
              activate(connector); // a little janky...can't use setError because the connector isn't set
            } catch {
              // activate(trazorConnector);
            }
          } else {
            setPendingError(true);
          }
        });
    } catch {}
  };

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
      <Text colorScheme="gray.200" fontSize="sm">
        Connected with {name.toString()}
      </Text>
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
          icon={require("../../../assets/images/" + option.iconName).default}
        />
      );
    });
  };

  return (
    <Modal closeOnOverlayClick={false} isCentered isOpen={selectedModal === 'wallet_modal'} onClose={closeModal}>
      <ModalOverlay />
      {walletView === WALLET_VIEWS.ACCOUNT && account ? (
        <ModalContent>
          <ModalHeader>Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px={1} py={5} rounded={5} borderWidth={1}>
              <Box px={3}>
                <Flex justify="space-between">
                  {formatConnectorName()}
                  <Flex>
                    {/* {connector !== injected && connector !== walletlink && (
                      <Button
                        size="xs"
                        mr={3}
                        outline="none"
                        colorScheme="red"
                        onClick={() => {
                          deactivate();
                          (connector as any).close();

                          // setAccountValue({signIn: false});
                        }}>
                        Disconnect
                      </Button>
                    )} */}
                    {(active || error) && (
                      <Button
                        size="xs"
                        mr={3}
                        outline="none"
                        colorScheme="red"
                        onClick={() => {
                          deactivate();
                          closeModal();
                        }}
                      >
                        Disconnect
                      </Button>
                    )}
                    <Button onClick={handleWalletChange} size="xs" outline="none" variant="outline">
                      Change
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="column">
                  {account && (
                    <Text fontSize="2xl" fontWeight={600}>
                      {trimAddress({
                        address: account,
                        firstChar: 7,
                        lastChar: 4,
                        dots: '....',
                      })}
                    </Text>
                  )}
                  <Flex pt={5} justify="flex-start">
                    <Text onClick={handleCopyAction} cursor="pointer" fontSize="sm" mr={3}>
                      {copyText}
                    </Text>
                    {/* {explorerLinkLoading ? (
                      <Skeleton />
                    ) : (
                      <Link
                        isExternal
                        href={`https://etherscan.io/address/${account}`}
                        fontSize="sm"
                        _hover={{
                          textDecoration: 'none',
                        }}>
                        View on Etherscan
                      </Link>
                    )} */}
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      ) : error ? (
        <ModalContent>
          <ModalHeader>
            {error instanceof UnsupportedChainIdError ? (
              <Text>
                Network not supported.
                <br />
                Please change to Rinkeby or Mainnet.
              </Text>
            ) : (
              <Text>Error connecting</Text>
            )}
            {/* {error instanceof UnsupportedChainIdError
              ? 'Network not supported' + <br /> + 'Please change to Rinkeby or Mainnet'
              : 'Error connecting'} */}
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
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
              <Text pt={3} fontSize="sm">
                New to Ethereum?{' '}
                <Link isExternal href="https://ethereum.org/wallets/">
                  Learn more about wallets
                </Link>
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
}

export default WalletModal;
