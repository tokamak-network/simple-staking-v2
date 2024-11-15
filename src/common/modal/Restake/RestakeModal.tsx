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
import Image from 'next/image'
import TITAN from '@/assets/images/titan_symbol.svg'
import ETHEREUM from '@/assets/images/ethereum_symbol.svg'
import BACK from '@/assets/images/back_icon.svg'
import { useWithdrawRequests } from '@/hooks/staking/useWithdrawable';
import { inputState } from '@/atom/global/input';
import { useRecoilState } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useIsOperator } from '@/hooks/staking/useIsOperator';
import NoLOGO from '@/assets/images/modal/gallery.svg'
import { WithdrawToEthereum } from '../withdraw/WithdrawToEthereum';

function WithdrawModal () {
  const theme = useTheme();
  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useModal();
  const { withdrawRequests } = useWithdrawRequests()

  const [requests, setRequests] = useState()

  const [modalName, setModalName] = useState('Restake')
  const [type, setType] = useState('main')
  const [number, setNumber] = useState(1)

  const [input, setInput] = useRecoilState(inputState);
  const [txPending, ] = useRecoilState(txState);

  const [logo, setLogo] = useState<string>('')
  // const { l2Infos } = useIsOperator(selectedModalData?.layer2)
  
  // useEffect(() => {
  //   if (l2Infos) {
  //     setLogo(l2Infos.logo)
  //   }
  // }, [l2Infos])

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
    const fetch = async () => {
      if (selectedModalData) {
        //@ts-ignore
        const { pendingRequests } = await withdrawRequests(selectedModalData.layer2)
        setRequests(pendingRequests)
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
        selectedModal === 'restake'
      }
      isCentered
      onClose={closeThisModal}
    >
      <ModalOverlay>
        <ModalContent 
          maxW={'350px'} 
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
                    main={'Restake'}
                    sub={'DAO Candidates:'}
                    closeThisModal={closeThisModal}
                    type={number}
                    sub2={selectedModalData.name}
                  />
                </Flex>
                <Flex bgColor={'#f4f6f8'} h={'1px'}  w={'100%'} />
                <WithdrawToEthereum 
                  selectedModalData={selectedModalData}
                  requests={requests}
                  closeThisModal={closeThisModal}
                  type={'Restake'}
                />
              </Flex>
            </ModalBody>
          ): ''} 
        </ModalContent>
      </ModalOverlay>
      
    </Modal>
  )

}

export default WithdrawModal