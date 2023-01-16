import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, useTheme, Text, Button, Input } from '@chakra-ui/react';
import useModal from '@/hooks/useModal';
import { useCallback, useState } from 'react';
import { ModalHeader } from './modal/ModalHeader';
import { CalculatorBody } from './modal/CalculatorBody';
import { useRecoilValue } from 'recoil';
import { selectedDurationState } from '@/atom/staking/duration';
import useOperatorList from '@/hooks/staking/useOperatorList';
import { convertNumber } from '@/components/number';
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import { inputBalanceState } from '@/atom/global/input';

function CalculatorModal () {
  const theme = useTheme()
  const {btnStyle} = theme;
  const { account } = useWeb3React();
  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useModal();
  
  const duration = useRecoilValue(selectedDurationState)
  const input = useRecoilValue(inputBalanceState)

  const [type, setType] = useState<'calculate' | 'result'>('calculate')
  const [roi, setROI] = useState('0')
  const [rewardTON, setRewardTON] = useState('0.00')
  const [rewardKRW, setRewardKRW] = useState('0.00')
  const [rewardUSD, setRewardUSD] = useState('0.00')

  const { totalStaked, userTotalStaked } = useOperatorList();
  const { userTonBalance } = useUserBalance(account)
  
  // const Staked = totalStaked ? convertNumber({
  //   amount: totalStaked,
  //   type: 'ray',
  //   localeString: true
  // }) : '0.00' 

  const Staked = '13,978,930.15'

  const userStaked = userTotalStaked ? convertNumber({
    amount: userTotalStaked,
    type: 'ray',
    localeString: true
  }) : '0.00' 

  // console.log(Staked)

  const closeThisModal = useCallback(() => {
    // setResetValue();
    // setInput('0')
    setType('calculate');
    closeModal();
  }, [closeModal]);

  const calButton = useCallback(() => {
    console.log(duration)
    const inputBalance = Number(input.replace(/,/g, ''))
    const maxCompensate = 26027.39726
    const pSeigDeduction = 40
    if (Staked) {
      const total = Number(Staked.replace(/,/g, '')) + inputBalance
      const unit = duration === 'Year' ? 365 : duration === 'Month' ? 30 : 7
      
      const stakedRatio = total/40000000
      const compensatePeraDay = stakedRatio * maxCompensate
      const dailyNotMintedSeig = maxCompensate - maxCompensate*(stakedRatio);
      const proportionalSeig = dailyNotMintedSeig * (pSeigDeduction / 100)
      const expectedSeig = (inputBalance/total) * (Number(compensatePeraDay) + proportionalSeig) * unit;
      const my = inputBalance + expectedSeig
      const returnRate = (my / inputBalance * 100 - 100);
      const roi = returnRate.toLocaleString(undefined, { maximumFractionDigits: 2})
      const rewardTON = expectedSeig.toLocaleString(undefined, { maximumFractionDigits: 4})
      setRewardTON(rewardTON)
      setROI(roi)
      setType('result')
    }
  }, [Staked, duration, input])
  const recalcButton = useCallback(() => {
    setType('calculate')
  }, [])

  return (
    <Modal
      isOpen={selectedModal === "calculator"}
      isCentered
      onClose={closeThisModal}
    >
      <ModalOverlay>
        <ModalContent
          bg={'#fff'}
          w={'350px'}
          borderRadius={'15px'}
          boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
        >
          <ModalBody>
            <Flex w="100%" flexDir={'column'} alignItems={'center'} py={'10px'}>
              <ModalHeader 
                main={'Staking Calculator'}
                sub={'Calculating hot much you can earn'}
                closeThisModal={closeThisModal}
              />
              <Flex w={'350px'} borderY={'1px'} py={'4px'} borderColor={'#f4f6f8'} flexDir={'column'} alignItems={'center'}>
                <Flex>
                  {type === 'calculate' ?
                    <CalculatorBody 
                      userBalance={userTonBalance}
                      totalStaked={Staked}
                    /> : 
                    <Flex flexDir={'column'} alignItems={'center'}>
                      <Text 
                        mt={'30px'}
                        fontSize={'13px'}
                        fontWeight={'normal'}
                        color={'#2a72e5'}
                      >
                        You can earn about
                      </Text>
                      <Flex flexDir={'row'} justifyContent={'center'} alignItems={'end'} mt={'18px'}>
                        <Text
                          fontSize={'32px'}
                          fontWeight={500}
                          color={'#304156'}
                          h={'43px'}
                        >
                          {rewardTON}
                        </Text>
                        <Text
                          ml={'5px'}
                          fontSize={'13px'}
                          fontWeight={500}
                          color={'#3d495d'}
                        >
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
                  }
                </Flex>
              </Flex>
              <Flex flexDir={'column'} alignItems={'center'} mt={'25px'}>
              {type === 'calculate' ?
                <Button
                  w={'150px'}
                  h={'38px'}
                  fontSize={'14px'}
                  {...btnStyle.btnAble()}
                  onClick={() => calButton()}
                >
                  Calculate
                </Button>
                : 
                <Flex
                  flexDir={'row'}
                >
                  <Button
                    w={'130px'}
                    h={'38px'}
                    fontSize={'14px'}
                    {...btnStyle.btnAble()}
                    mr={'10px'}
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
              }
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

export default CalculatorModal