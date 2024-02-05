import { Container, Center, Box, Text, Heading, Button, Grid, Flex, useColorMode, useTheme } from '@chakra-ui/react';
import React, { FC, useState, useCallback } from 'react';
// import {LoadingComponent} from 'components/Loading';

import { useEffect } from 'react';

import { LoadingDots } from 'common/Loader/LoadingDots';
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import { usePendingUnstaked } from '@/hooks/staking/usePendingUnstaked';
import StakeModal from './StakeModal';
import { ModalType } from '@/types/modal';
import { modalData, modalState } from '@/atom/global/modal';
import { useRecoilState } from 'recoil';
import CalculatorModal from './CalculatorModal';
import { useUserHistory } from '@/hooks/wallet/useUserHIstory';
import { useWithdrawable } from '../../../hooks/staking/useWithdrawable';
import { convertNumber } from '@/components/number';
import { getOldLayerAddress } from '@/components/getOldLayerAddress';

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
  const [candidateContracts, setCandidateContracts] = useState('');
  const [candidates, setCandidates] = useState('');
  const [stakeOfUser, setStakeOfUser] = useState('');
  const [expSeig, setExpSeig] = useState('');
  const [stakeCandidate, setStakeCandidate] = useState('');

  const { userTonBalance, userWTonBalance } = useUserBalance(account);
  // const {
  //   candidateContract,
  //   stakeOf,
  //   candidate,
  //   expectedSeig,
  //   stakeOfCandidate
  // } = data

  useEffect(() => {
    setCandidateContracts(data?.candidateContract);
    setCandidates(data?.candidate);
    setStakeOfUser(data?.stakeOf);
    setExpSeig(data?.expectedSeig);
    setStakeCandidate(data?.stakeOfCandidate);
  }, [data]);

  const { pendingUnstaked } = usePendingUnstaked(data?.candidateContract, account);
  const { withdrawable, withdrawableLength, old_withdrawable, old_withdrawableLength } = useWithdrawable(
    data?.candidateContract,
  );

  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [, setSelectedModalData] = useRecoilState(modalData);

  const yourStaked = stakeOfUser
    ? convertNumber({
        //@ts-ignore
        amount: stakeOfUser,
        type: 'ray',
        localeString: true,
      })
    : '-';

  const expectedSeigs = expSeig
    ? convertNumber({
        amount: expSeig,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
  
  const btnDisabledStake = () => {
    return account && (userTonBalance !== '0.00' || userWTonBalance !== '0.00') ? setStakeDisabled(false) : setStakeDisabled(true);
  };

  const btnDisabledReStake = () => {
    return account === undefined || pendingUnstaked === '0.00' ? setReStakeDisabled(true) : setReStakeDisabled(false);
  };

  const btnDisabledUnStake = () => {
    return account === undefined || yourStaked === '0.00' || yourStaked === '-'
      ? setUnstakeDisabled(true)
      : setUnstakeDisabled(false);
  };

  const btnDisabledWithdraw = () => {
    return account === undefined || (withdrawable === '0.00' && old_withdrawable === '0.00')
      ? setwithdrawDisabled(true)
      : setwithdrawDisabled(false);
  };

  useEffect(() => {
    btnDisabledStake();
    btnDisabledUnStake();
    btnDisabledReStake();
    btnDisabledWithdraw();
    /*eslint-disable*/
  }, [account, pendingUnstaked, userTonBalance, withdrawable, old_withdrawable]);

  const candidateAmount = stakeCandidate
    ? convertNumber({
        amount: stakeCandidate,
        type: 'ray',
      })
    : '0.00';
  const minimumAmount = Number(candidateAmount) > 100;

  const dataModal = {
    tonBalance: userTonBalance,
    wtonBalance: userWTonBalance,
    pendingUnstaked: pendingUnstaked,
    stakedAmount: yourStaked,
    withdrawable: withdrawable,
    old_withdrawable: old_withdrawable,
    layer2: candidateContracts,
    old_layer2: getOldLayerAddress(candidateContracts),
    withdrawableLength: withdrawableLength,
    old_withdrawableLength: old_withdrawableLength,
    seig: expectedSeigs,
    candidate: candidates,
    minimumAmount: minimumAmount,
  };

  const modalButton = useCallback(async (modalType: ModalType, data: any) => {
    setSelectedModal(modalType);
    setSelectedModalData(data);
  }, []);

  const theme = useTheme();
  const { btnStyle } = theme;

  return (
    <Container maxW={'sm'} shadow={'md'} borderRadius={'lg'} border={'solid 1px #f4f6f8'}>
      <Box w={'100%'} p={0} textAlign={'center'} pb={'30px'} px={5}>
        <Flex
          mt={'20px'}
          fontSize={'11px'}
          color={'#2a72e5'}
          w={'100%'}
          justifyContent={'end'}
          cursor={'pointer'}
          h={'13px'}
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
          {account == undefined ? <Text>- </Text> : userTonBalance === undefined ? <LoadingDots /> : userTonBalance} TON
        </Heading>
        <Box pt={'5px'} pb={'30px'}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={4}>
          <Button
            {...(stakeDisabled ? { ...btnStyle.btnDisable() } : { ...btnStyle.btnAble() })}
            isDisabled={stakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalButton('staking', dataModal)}
          >
            Stake
          </Button>
          <Button
            {...(unstakeDisabled ? { ...btnStyle.btnDisable() } : { ...btnStyle.btnAble() })}
            isDisabled={unstakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalButton('unstaking', dataModal)}
          >
            Unstake
          </Button>
          <Button
            {...(reStakeDisabled ? { ...btnStyle.btnDisable() } : { ...btnStyle.btnAble() })}
            isDisabled={reStakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalButton('restaking', dataModal)}
          >
            Restake
          </Button>
          <Button
            {...(withdrawDisabled === true ? { ...btnStyle.btnDisable() } : { ...btnStyle.btnAble() })}
            isDisabled={withdrawDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalButton('withdraw', dataModal)}
          >
            Withdraw
          </Button>

          {loading === true ? (
            <Flex pos="absolute" zIndex={100} w="100%" h="100%" alignItems="cneter" justifyContent="center">
              <Center>{/* <LoadingComponent></LoadingComponent> */}</Center>
            </Flex>
          ) : null}
        </Grid>
      </Box>
      <StakeModal />
      <CalculatorModal />
    </Container>
  );
};

export default WalletInformation;
