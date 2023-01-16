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
// import {LoadingComponent} from 'components/Loading';

import {useEffect} from 'react';

import {LoadingDots} from 'common/Loader/LoadingDots';
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import { usePendingUnstaked } from '@/hooks/staking/usePendingUnstaked';
import StakeModal from './StakeModal';
import { ModalType } from '@/types/modal';
import { modalData, modalState } from '@/atom/global/modal';
import { useRecoilState } from 'recoil';
import CalculatorModal from './CalculatorModal';

type WalletInformationProps = {
  // dispatch: AppDispatch;
  data: any;
};

export const WalletInformation: FC<WalletInformationProps> = ({
  data,
  // dispatch,
}) => {
  const [loading, setLoading] = useState(false);
  const { account, library } = useWeb3React();
  
  //Buttons
  const [stakeDisabled, setStakeDisabled] = useState(true);
  const [unstakeDisabled, setUnstakeDisabled] = useState(true);
  const [reStakeDisabled, setReStakeDisabled] = useState(true);
  const [withdrawDisabled, setwithdrawDisabled] = useState(true);

  const { userTonBalance } = useUserBalance(account)
  const { pendingUnstaked } = usePendingUnstaked(data.layer2, account)

  // const { openModal } = useModal('stake_stake_modal', userTonBalance)
  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [selectedModalData, setSelectedModalData] = useRecoilState(modalData);

  const btnDisabledStake = () => {
    return account === undefined ||
      userTonBalance === '0.00'
        ? setStakeDisabled(true)
        : setStakeDisabled(false);
  };

  const btnDisabledReStake = () => {
    return account === undefined ||
      pendingUnstaked === '0.00'
        ? setReStakeDisabled(true)
        : setReStakeDisabled(false);
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
    btnDisabledReStake()
    /*eslint-disable*/
  }, [account, pendingUnstaked])

  const dataModal = {
    tonBalance: userTonBalance,
    pendingUnstaked: pendingUnstaked,
    stakedAmount: data.yourStaked,
    withdrawable: '',
    layer2: data.layer2,
  }
  const modalButton = useCallback(
    async (modalType: ModalType, data: any) => {
      
      setSelectedModal(modalType)
      setSelectedModalData(data)
    }, [])

  const theme = useTheme();
  const {btnStyle} = theme;

  return (
    <Container
      maxW={'sm'}
      shadow={'md'}
      borderRadius={'lg'}
      border={'solid 1px #f4f6f8'}
    >
      <Box w={'100%'} p={0} textAlign={'center'} pb={'30px'} px={5}>
        <Flex 
          mt={'20px'} 
          fontSize={'11px'} 
          color={'#2a72e5'} 
          w={'100%'} 
          justifyContent={'end'} 
          cursor={'pointer'}
          onClick={() => modalButton('calculator', dataModal)}
        >
          Simulator
        </Flex>
        <Heading
          color={'#2a72e5'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight={500}
          // fontSize={'42px'}
          h={'55px'}
        >
          {userTonBalance === undefined 
            || account == undefined 
          ? (
            <LoadingDots />
          ) : (
            userTonBalance
          )}{' '}
          TON
        </Heading>
        <Box pt={'5px'} pb={'30px'}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={4}>
          <Button
            {...(stakeDisabled
              ? {...btnStyle.btnDisable()}
              : {...btnStyle.btnAble()})}
            isDisabled={stakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalButton('staking', dataModal)}
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
            onClick={() => modalButton('unstaking', dataModal)}
          >
            Unstake
          </Button>
          <Button
            {...(reStakeDisabled
              ? {...btnStyle.btnDisable()}
              : {...btnStyle.btnAble()})}
            isDisabled={reStakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalButton('restaking', dataModal)}
          >
            Re-Stake
          </Button>
          <Button
            {...(withdrawDisabled === true
              ? {...btnStyle.btnDisable()}
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
            justifyContent="center"
          >
            <Center>
              {/* <LoadingComponent></LoadingComponent> */}
            </Center>
          </Flex>
          ) : null}
        </Grid>
      </Box>
      <StakeModal />
      <CalculatorModal />
    </Container>
  );
};
