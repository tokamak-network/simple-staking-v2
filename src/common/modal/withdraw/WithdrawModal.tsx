import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useTheme,
} from '@chakra-ui/react';
import useModal from '@/hooks/useModal';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ModalHeader } from '../../../pages/components/staking/modal/ModalHeader';
import { WithdrawType } from './WithdrawType';
import Image from 'next/image'
import TITAN from '@/assets/images/titan_symbol.svg'
import ETHEREUM from '@/assets/images/ethereum_symbol.svg'
import BACK from '@/assets/images/back_icon.svg'
import { ToEthereum } from './ToEthereum';
import { ToTitan } from './ToTitan';
import { useWithdrawRequests } from '@/hooks/staking/useWithdrawable';
import { inputState } from '@/atom/global/input';
import { useRecoilState } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useIsOperator } from '@/hooks/staking/useIsOperator';
import NoLOGO from '@/assets/images/modal/gallery.svg'

function WithdrawModal () {
  const theme = useTheme();
  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useModal();
  const { withdrawRequests } = useWithdrawRequests()

  const [requests, setRequests] = useState()

  const [modalName, setModalName] = useState('Withdraw')
  const [type, setType] = useState('main')
  const [number, setNumber] = useState(1)

  const [input, setInput] = useRecoilState(inputState);
  const [txPending, ] = useRecoilState(txState);

  const [logo, setLogo] = useState<string>('')
  const { l2Infos } = useIsOperator(selectedModalData?.layer2)
  
  useEffect(() => {
    if (l2Infos) {
      setLogo(l2Infos.logo)
    }
  }, [l2Infos])

  const closeThisModal = useCallback(() => {
    setInput('');
    setType('main')
    closeModal();
  }, [closeModal]);

  const back = useCallback(() => {
    setType('main')
    setInput('')
  }, [])

  useEffect(() => {
    type === 'main' 
    ? setModalName('Withdraw')
    : type === 'ethereum'
    ? setModalName('Withdraw to Ethereum')
    : setModalName(`Withdraw to ${selectedModalData?.name}`)
  }, [type])

  useEffect(() => {
    const fetch = async () => {
      if (selectedModalData) {
        const withdrawRequest = await withdrawRequests(selectedModalData.layer2)
        setRequests(withdrawRequest)
      }
    }
    fetch()
  }, [selectedModalData, txPending])
  
  useEffect(() => {
    let numberOf = 1
    if (selectedModalData) {
      numberOf = selectedModalData.isL2 ?  numberOf + 1 : numberOf
      numberOf = selectedModalData.old_withdrawable !== '0.00' ? numberOf + 1 : numberOf
    }
    setNumber(numberOf)
  }, [selectedModalData])
  
  return (
    <Modal
      isOpen={
        selectedModal === 'withdraw'
      }
      isCentered
      onClose={closeThisModal}
    >
      <ModalOverlay>
        <ModalContent 
          maxW={
            number === 3 && type === 'main'
            ? '1020px'
            : number === 2 && type === 'main'
            ? '690px' 
            : '350px'
          } 
          bg={'#fff'} 
          borderRadius={'15px'} 
          boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
        >
          {selectedModalData ? (
            <ModalBody>
              <Flex w="100%" flexDir={'column'} alignItems={'center'} py={'20px'}>
                <Flex flexDir={'row'}  justifyContent={type !== 'main' ? 'start' : 'center'} w={'100%'}>
                  {
                    type !== 'main' ?
                    <Flex 
                      alignItems={'center'} 
                      mt={'10px'} 
                      h={'24px'} 
                      w={'24px'} 
                      mr={type === 'ethereum' ? '26px' : '44px'}
                      cursor={'pointer'}
                      onClick={() => back()}
                    >
                      <Image src={BACK} alt={''} />
                    </Flex> : ''
                  }
                  <ModalHeader
                    main={modalName}
                    sub={''}
                    closeThisModal={closeThisModal}
                    type={number}
                  />
                </Flex>
                <Flex bgColor={'#f4f6f8'} h={'1px'}  w={'100%'} />
                {
                  type === 'main' ?
                  <Flex justifyContent={'space-between'} alignItems={'space-between'} mt={'30px'} w={'100%'}>
                    {
                      selectedModalData.old_withdrawable !== '0.00' ?
                      <WithdrawType 
                        name={'Prior to Patch'}
                        content={'Any unstaked TON from the original staking contract with the zero-day vulnerability can be withdrawn to Ethereum.'}

                      /> : ''
                    }
                    <WithdrawType 
                      name={'Withdraw to Ethereum'}
                      content={'Staked TON can be unstaked and can be withdrawn after 93,046 blocks from unstaking (~14 days).'}
                      src={ETHEREUM.src}
                      onClick={() => setType('ethereum')}
                    />
                    {
                      selectedModalData.isL2 ?
                      <WithdrawType 
                        name={`Withdraw to ${selectedModalData.name}`}
                        content={'Instead of withdrawing to Ethereum, staked TON can be withdrawn to this layer as TON. By withdrawing to this layer, TON can be used right away without needing to wait for 14 days.'}
                        src={logo ? logo : NoLOGO.src}
                        onClick={() => setType('titan')}
                      /> : ''
                    }
                  </Flex> :
                  type === 'ethereum' ?
                  <ToEthereum 
                    selectedModalData={selectedModalData}
                    requests={requests}
                    closeThisModal={closeThisModal}
                  /> :
                  type === 'titan' ?
                  <ToTitan 
                    selectedModalData={selectedModalData}
                    closeThisModal={closeThisModal}
                  /> : ''
                }
              </Flex>
            </ModalBody>
          ): ''} 
        </ModalContent>
      </ModalOverlay>
      
    </Modal>
  )

}

export default WithdrawModal