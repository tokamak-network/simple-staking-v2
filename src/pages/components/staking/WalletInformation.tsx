import {
  Container,
  Center,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import React, {FC, useState, useCallback} from 'react';

// import {Stake} from 'pages/Staking/types';

// import {LoadingComponent} from 'components/Loading';

import {useEffect} from 'react';

import {LoadingDots} from 'common/Loader/LoadingDots';
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';

type WalletInformationProps = {
  // dispatch: AppDispatch;
  data: any;
};

export const WalletInformation: FC<WalletInformationProps> = ({
  data,
  // dispatch,
}) => {
  const {colorMode} = useColorMode();
  const [loading, setLoading] = useState(false);
  const { account, library } = useWeb3React();
  

  //Buttons
  const [stakeDisabled, setStakeDisabled] = useState(true);
  const [unstakeDisabled, setUnstakeDisabled] = useState(true);
  const [reStakeDisabled, setReStakeDisabled] = useState(true);
  const [withdrawDisabled, setwithdrawDisabled] = useState(true);

  const { userTonBalance } = useUserBalance()

  const btnDisabledStake = () => {
    return account === undefined ||
      userTonBalance === '0.00'
      ? setStakeDisabled(true)
      : setStakeDisabled(false);
  };

  const btnDisabledUnStake = () => {
    return account === undefined ||
      data.yourStaked === '0.00'
      ? setUnstakeDisabled(true)
      : setUnstakeDisabled(false);
  };

  useEffect(() => {
    btnDisabledStake()
    btnDisabledUnStake()
  }, [])
  // console.log(account === undefined ||
  //   userTonBalance === '0.00')
  // console.log('stakedisable',stakeDisabled)
  // console.log(userTonBalance)
  // const withdrawBtnDisabled = account === undefined ? true : false;


  // const modalPayload = async (args: any) => {
  //   const {account, library, contractAddress, vault} = args;
  //   const result = await fetchwithdrawModalPayload(
  //     library,
  //     account,
  //     contractAddress,
  //     vault,
  //   );

  //   return result;
  // };

  

  // const modalData = useCallback(
  //   async (modal: ModalType) => {
  //     setLoading(true);
  //     let payload;
  //     const {contractAddress, vault} = data;
  //     try {
  //       if (modal === 'withdraw') {
  //         const payloadModal = await modalPayload({
  //           account,
  //           library,
  //           contractAddress,
  //           vault,
  //         });
  //         payload = {
  //           ...data,
  //           ...payloadModal,
  //         };
  //       } else if (modal === 'claim') {
  //         payload = {
  //           contractAddress,
  //           tosBalance,
  //         };
  //       } else if (modal === 'unstake') {
  //         if (!account || !library) {
  //           return;
  //         }
  //         const payloadModal = await getUserBalance(
  //           account,
  //           library,
  //           data.contractAddress,
  //         );
  //         payload = {
  //           ...data,
  //           totalStakedBalance: payloadModal?.totalStakedBalance,
  //         };
  //       } else {
  //         payload = {
  //           ...data,
  //           userTonBalance,
  //         };
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       setLoading(false);
  //     }

  //     setLoading(false);
  //     dispatch(openModal({type: modal, data: payload}));
  //   },
  //   [data, tosBalance, transactionType, blockNumber],
  // ); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = useTheme();
  const {btnStyle} = theme;

  return (
    <Container
      maxW={'sm'}
      shadow={'md'}
      borderRadius={'lg'}
      border={
        colorMode === 'light' ? 'solid 1px #f4f6f8' : 'solid 1px #373737'
      }>
      <Box w={'100%'} p={0} textAlign={'center'} py={10} px={5}>
        <Heading
          color={'#2a72e5'}
          display="flex"
          alignItems="center"
          justifyContent="center">
          {userTonBalance === undefined 
          // && account !== undefined 
          ? (
            <LoadingDots />
          ) : (
            userTonBalance
          )}{' '}
          TON
        </Heading>
        <Box py={5}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button
            {...(stakeDisabled
              ? {...btnStyle.btnDisable()}
              : {...btnStyle.btnAble()})}
            isDisabled={btnDisabledStake}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            // onClick={() => modalData('stake')}
          >
            Stake
          </Button>
          <Button
            {...(unstakeDisabled 
              ? {...btnStyle.btnDisable()}
              : {...btnStyle.btnAble()})}
            isDisabled={unstakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            // onClick={() => modalData('unstake')}
          >
            Unstake
          </Button>
          <Button
            {...(reStakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={reStakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            // onClick={() => modalData('claim')}
          >
            Re-Stake
          </Button>
          <Button
            {...(withdrawDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={withdrawDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            // onClick={() => modalData('withdraw')}
          >
            Withdraw
          </Button>

          {loading === true ? (
            <Flex
              pos="absolute"
              zIndex={100}
              w="100%"
              h="100%"
              alignItems="cneter"
              justifyContent="center">
              <Center>
                {/* <LoadingComponent></LoadingComponent> */}
              </Center>
            </Flex>
          ) : null}
        </Grid>
      </Box>
    </Container>
  );
};
