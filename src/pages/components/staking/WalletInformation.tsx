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
import { StakeModalDataType } from "types"
import WalletModal from '@/common/modal/Wallet';
import useModal from '@/hooks/useModal';
import { minimumAmountState } from '@/atom/staking/minimumAmount';
import WithdrawModal from '../../../common/modal/withdraw/WithdrawModal';
import ClaimModal from '@/common/modal/L2Info/ClaimModal';

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
  const [name, setName] = useState('');
  const [stakeCandidate, setStakeCandidate] = useState('');
  const [minimumAmount, setMinimumAmount] = useRecoilState(minimumAmountState)
  const [minimumAmountForButton, setMinimumAmountForButton] = useState<boolean>(false);
  const [isOperator, setIsOperator] = useState<boolean>(false);
  const [isL2, setIsL2] = useState<boolean>(false);

  const { userTonBalance, userWTonBalance } = useUserBalance(account);
  const { openModal } = useModal('wallet');
  // const {
  //   candidateContract,
  //   stakeOf,
  //   candidate,
  //   expectedSeig,
  //   stakeOfCandidate
  // } = data
  

  useEffect(() => {
    if (data) {
      setCandidateContracts(data.candidateContract);
      setCandidates(data.candidate);
      setStakeOfUser(data.stakeOf);
      setExpSeig(data.expectedSeig);
      setStakeCandidate(data.stakeOfCandidate);
      setIsL2(data.candidateAddOn !== null)
      setName(data.name)
    }
  }, [data]);

  useEffect(() => {
    if (account) {
      setIsOperator(candidates.toLowerCase() === account.toLowerCase())
    }
  }, [account, candidates])
  const { pendingUnstaked } = usePendingUnstaked(data?.candidateContract, account);
  const { withdrawable, withdrawableLength, old_withdrawable, old_withdrawableLength, requests } = useWithdrawable(
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
  : '1000.1';
  
  const candidateAmountForButton = stakeCandidate
  ? convertNumber({
      amount: stakeCandidate,
      type: 'ray',
    })
  : '0.00';

  useEffect(() => {
    // console.log(Number(candidateAmount), Number(candidateAmount) > 1000)
    setMinimumAmount(Number(candidateAmount) > 1000)
    setMinimumAmountForButton(Number(candidateAmountForButton) > 1000)

  }, [account, candidateAmount])
  
  const dataModal: StakeModalDataType = {
    tonBalance: userTonBalance ? userTonBalance : '0.00',
    wtonBalance: userWTonBalance ? userWTonBalance : '0.00',
    stakedAmount: yourStaked ? yourStaked : '0.00',
    layer2: candidateContracts,
    withdrawableLength: withdrawableLength,
    seig: expectedSeigs ? expectedSeigs : '0.00',
    candidate: candidates,
    minimumAmount: minimumAmount,
    pendingUnstaked: pendingUnstaked,
    withdrawable: withdrawable,
    // old_withdrawableLength: old_withdrawableLength,
    old_withdrawableLength: '1',
    old_withdrawable: old_withdrawable,
    old_layer2: getOldLayerAddress(candidateContracts) ? getOldLayerAddress(candidateContracts) : '',
    requests: requests,
    isL2: isL2,
    name: name
  };

  const modalButton = useCallback(async (modalType: ModalType, data: any) => {
    setSelectedModal(modalType);
    setSelectedModalData(data);
  }, [dataModal]);

  const theme = useTheme();
  const { btnStyle } = theme;

  return (
    <Container maxW={'sm'} shadow={'md'} borderRadius={'lg'} border={'solid 1px #f4f6f8'} h={'253px'}>
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
          {
            // userTonBalance === undefined 
            // ? <LoadingDots /> 
            // : (
              <Flex flexDir={'row'} color={'#304156'} fontSize={'18px'} fontWeight={'bold'}>
                <Flex alignItems={'end'}>
                  {account ? userTonBalance : '-'}
                  <Text fontSize={'13px'} fontWeight={500} ml={'3px'}>
                    TON
                  </Text>
                </Flex>
                <Flex mx={'6px'} color={'#c7d1d8'} fontWeight={'normal'}>
                  /
                </Flex>
                <Flex alignItems={'end'}>
                  {account ? userWTonBalance : '-'}
                  <Text fontSize={'13px'} fontWeight={500} ml={'3px'}>
                    WTON
                  </Text>
                </Flex>
              </Flex>
            // )
            }
        </Heading>
        <Box pt={'35px'} pb={'20px'}>
          <Text fontSize={'15px'} color={'#808992'}>
            Available in wallet
          </Text>
        </Box>
        {
          account ?
          <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={4}>
            <Button
              {...(minimumAmountForButton || isOperator ? { ...btnStyle.btnAble() } : { ...btnStyle.btnDisable() })}
              isDisabled={minimumAmountForButton || isOperator ? false : true}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() => modalButton('staking', dataModal)}
            >
              Stake
            </Button>
            
            <Button
              {...(minimumAmountForButton || isOperator ? { ...btnStyle.btnAble() } : { ...btnStyle.btnDisable() })}
              isDisabled={minimumAmountForButton || isOperator ? false : true}
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
          :
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            mt={'20px'}
            
          >
            <Button
              {...btnStyle.btnAble()}
              isDisabled={false}
              onClick={openModal}
            >
              Connect wallet
            </Button>
          </Flex>
        }
      </Box>
      {/* <StakeModal />
      <WithdrawModal />
      <WalletModal />
      <CalculatorModal /> */}
    </Container>
  );
};

export default WalletInformation;
