import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, useTheme, Text, Button, Input } from '@chakra-ui/react';
import useModal from '@/hooks/useModal';
import { useCallback, useMemo, useState } from 'react';
import { ModalHeader } from './modal/ModalHeader';
import { CalculatorBody } from './modal/CalculatorBody';
import { useRecoilState, useRecoilValue } from 'recoil';
import { durationState, selectedDurationState } from '@/atom/staking/duration';
import useOperatorList from '@/hooks/staking/useOperatorList';
import { convertNumber } from '@/components/number';
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import { inputBalanceState } from '@/atom/global/input';
import { modalState } from '@/atom/global/modal';
import axios from 'axios';
import { getTotalSupply } from '@/api';
import { calculateRoi, calculateRoiBasedonCompound } from '@/components/calculateRoi';
import { useDailyStaked } from '@/hooks/home/useDailyStaked';
import { useKrwPrice } from '../../../hooks/staking/useKRWPrice';
import { useTONPrice } from '@/hooks/staking/useTONPrice';

function CalculatorModal() {
  const theme = useTheme();
  const { btnStyle } = theme;
  const { account } = useWeb3React();
  const { closeModal, isModalLoading, selectedModalData } = useModal();

  const [duration, setDuration] = useRecoilState(durationState);
  // const duration = useRecoilValue(selectedDurationState)
  const input = useRecoilValue(inputBalanceState);
  const [selectedModal, setSelectedModal] = useRecoilState(modalState);

  const [type, setType] = useState<'calculate' | 'result'>('calculate');
  const [roi, setROI] = useState('0');
  const [rewardTON, setRewardTON] = useState('0.00');
  const [rewardKRW, setRewardKRW] = useState('0.00');
  const [rewardUSD, setRewardUSD] = useState('0.00');

  const { userTonBalance } = useUserBalance(account);
  const { dailyStaked } = useDailyStaked();
  const {} = useKrwPrice()
  const {tonPriceKRW, tonPriceUSD} = useTONPrice()

  const Staked = dailyStaked[0]
    ? convertNumber({
        amount: dailyStaked[0]?.totalSupply,
        type: 'ray',
        localeString: true,
      })
    : undefined;

  const closeThisModal = useCallback(() => {
    // setResetValue();
    // setInput('0')
    setType('calculate');
    setDuration('1-year');
    closeModal();
  }, [closeModal, setDuration]);

  const calButton = useCallback(async () => {
    const inputBalance = Number(input.replace(/,/g, ''));
    const maxCompensate = 26027.39726;
    const pSeigDeduction = 40;
    // const KRW = await axios('https://api.upbit.com/v1/ticker?markets=KRW-TON').then((response: any) => {
    //   return JSON.parse(JSON.stringify(response.data).replace(/]|[[]/g, '')).trade_price;
    // });
    // const usdRates = await axios('https://api.frankfurter.app/latest?from=KRW').then((response): any => {
    //   //@ts-ignore
    //   return response.data.rates.USD;
    // });
    const totalSup = await getTotalSupply();
    // const USD = KRW * usdRates;
    if (Staked) {
      const total = Number(Staked.replace(/,/g, '')) + inputBalance;

      const unit = duration === '1-year' ? 365 : duration === '6-month' ? 30 : 7;

      const returnRate = calculateRoiBasedonCompound({ totalStakedAmount: total, totalSupply: totalSup, duration });

      const stakedRatio = total / totalSup;
      const compensatePeraDay = stakedRatio * maxCompensate;
      const dailyNotMintedSeig = maxCompensate - maxCompensate * stakedRatio;
      const expectedSeig = inputBalance * (returnRate / 100);

      // const roi = returnRate.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const rewardTON = expectedSeig.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const rewardUSD = (expectedSeig * tonPriceUSD).toLocaleString(undefined, { maximumFractionDigits: 2 });
      const rewardKRW = (expectedSeig * tonPriceKRW).toLocaleString(undefined, { maximumFractionDigits: 0 });

      // const rewardUSD = (expectedSeig * USD).toLocaleString(undefined, { maximumFractionDigits: 2 });
      // const rewardKRW = (expectedSeig * KRW).toLocaleString(undefined, { maximumFractionDigits: 0 });

      setRewardKRW(rewardKRW);
      setRewardUSD(rewardUSD);
      setRewardTON(rewardTON);
      setROI(
        returnRate?.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) ?? '-',
      );
      setType('result');
    }
  }, [Staked, duration, input, dailyStaked]);

  const recalcButton = useCallback(() => {
    setType('calculate');
    setDuration('1-year');
  }, [setDuration]);

  const toStakeButton = useCallback(async () => {
    setSelectedModal('staking');
    setType('calculate');
    setDuration('1-year');
  }, [setDuration, setSelectedModal]);

  const totalStakedAmount = useMemo(() => {
    //@ts-ignore
    return selectedModalData?.stakedAmount ?? undefined;
    //@ts-ignore
  }, [selectedModalData?.stakedAmount]);

  return (
    <Modal isOpen={selectedModal === 'calculator'} isCentered onClose={closeThisModal}>
      <ModalOverlay>
        <ModalContent bg={'#fff'} w={'350px'} borderRadius={'15px'} boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}>
          <ModalBody>
            <Flex w="100%" flexDir={'column'} alignItems={'center'} py={'10px'}>
              <ModalHeader
                main={'Staking Calculator'}
                sub={'The calculation is based on monthly compounding interest.'}
                closeThisModal={closeThisModal}
              />
              <Flex
                w={'350px'}
                borderY={'1px'}
                py={'4px'}
                borderColor={'#f4f6f8'}
                flexDir={'column'}
                alignItems={'center'}
              >
                <Flex>
                  {type === 'calculate' ? (
                    <CalculatorBody userBalance={userTonBalance} totalStaked={totalStakedAmount} />
                  ) : (
                    <Flex flexDir={'column'} alignItems={'center'}>
                      <Text mt={'30px'} fontSize={'13px'} fontWeight={'normal'} color={'#2a72e5'}>
                        You can earn about
                      </Text>
                      <Flex flexDir={'row'} justifyContent={'center'} alignItems={'end'} mt={'18px'}>
                        <Text fontSize={'32px'} fontWeight={500} color={'#304156'} h={'43px'}>
                          {rewardTON}
                        </Text>
                        <Text ml={'5px'} fontSize={'13px'} fontWeight={500} color={'#3d495d'}>
                          TON
                        </Text>
                      </Flex>
                      <Flex
                        flexDir={'row'}
                        justifyContent={'space-between'}
                        mt={'30px'}
                        mb={'36px'}
                        h={'16px'}
                        w={'230px'}
                        fontSize={'12px'}
                        color={'#808992'}
                      >
                        <Text>${rewardUSD}</Text>
                        <Text>{roi}%</Text>
                        <Text>₩ {rewardKRW}</Text>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Flex>
              <Flex flexDir={'column'} alignItems={'center'} mt={'25px'}>
                {type === 'calculate' ? (
                  <Button w={'150px'} h={'38px'} fontSize={'14px'} {...btnStyle.btnAble()} onClick={() => calButton()}>
                    Calculate
                  </Button>
                ) : (
                  <Flex flexDir={'row'}>
                    <Button
                      w={'130px'}
                      h={'38px'}
                      fontSize={'14px'}
                      {...btnStyle.btnAble()}
                      mr={'10px'}
                      onClick={() => toStakeButton()}
                    >
                      Stake
                    </Button>
                    <Button
                      w={'130px'}
                      h={'38px'}
                      fontSize={'14px'}
                      {...btnStyle.btnAble()}
                      onClick={() => recalcButton()}
                    >
                      Recalculate
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export default CalculatorModal;
