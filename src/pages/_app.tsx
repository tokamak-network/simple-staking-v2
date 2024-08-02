import type { AppProps } from 'next/app';
import { Box, ChakraProvider, ColorModeScript, Flex, Text } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from 'utils/getLibrary';
import theme from 'theme';
import Footer from 'pages/components/layout/Footer';
import { RecoilRoot } from 'recoil';
import Header from 'pages/components/layout/Header';
import Entry from './entry';
import HeadMeta from './Header';
import MobileHeader from './components/layout/MobileHeader';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import MobileFooter from './components/layout/MobileFooter';
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from '../apollo';
import TokamakGNB from './components/layout/TokamakGNB';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import NetworkModal from './components/global/NetworkModal';
// import 'css/gradient.css';
// import 'css/modalOverlay.css';
// import CustomToast from 'common/toast/CustomToast';

function MyApp({ Component, pageProps }: AppProps) {
  const [width] = useWindowDimensions();
  const mobile = width && width < 1040;
  const queryClient = new QueryClient();

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={apolloClient}>
      <ColorModeScript initialColorMode={theme.initialColorMode} />
      <ChakraProvider resetCSS theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <HeadMeta></HeadMeta>
            <Flex minH={'100vh'} w={'100%'}>
              {/* PC VIEW = 1440px */}
              {/* TABLET VIEW = 1040px */}
              {/* MOBILE VIEW = 360px */}
              {mobile ? (
                <Flex flexDir={'column'} w={'100%'} alignItems={'center'} justifyContent={'space-between'}>
                  <MobileHeader />
                  <Entry Component={Component} {...pageProps} />
                  <MobileFooter />
                </Flex>
                // <Flex alignItems={'left'} justifyContent={'center'} px={'15px'} flexDir={'column'}>
                //   <Text mb={'10px'} fontWeight={'bold'}>Notice: Service Interruption Announcement</Text>
                //   <Text>
                //   Simple Staking Service is currently not usable via mobile browsers. We recommend using it from a desktop instead. We are working to open the mobile version soon. We apologize for the inconvenience and hope to provide you with a better experience as soon as possible.
                //   </Text>
                // </Flex>
              ) : (
                <Flex flexDir={'column'} w={'100%'} alignItems={'center'} justifyContent={'space-between'}>
                  <TokamakGNB />
                  <Header
                  // walletopen={() => handleWalletModalOpen("wallet")}
                  />
                  <Flex justifyContent="center" w={'100%'} alignItems="center" px={['', '24px', '0px']}>
                    <Flex
                      maxW={['100%', '100%', '100%']}
                      flexDir={'column'}
                      justifyContent="space-between"
                      w={'100%'}
                      minH={'90vh'}
                    >
                      <Entry Component={Component} {...pageProps} />
                      <Footer />
                      {/* <NetworkModal /> */}
                      {/* <TermsOfUse /> */}
                      {/* Use when it does need to pop Notice Modal up */}
                      {/* <Notice /> */}
                      {/* <CustomToast /> */}
                    </Flex>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </RecoilRoot>
        </QueryClientProvider>
      </ChakraProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
