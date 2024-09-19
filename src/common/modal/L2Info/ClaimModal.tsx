import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useTheme,
} from '@chakra-ui/react';
import useClaimModal from '@/hooks/useClaimModal';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ModalHeader } from '../../../pages/components/staking/modal/ModalHeader';

import { StakeModalComponentType } from '@/types';
import { useWithdrawRequests } from '@/hooks/staking/useWithdrawable';
import { inputState } from '@/atom/global/input';
import { useRecoilState } from 'recoil';

function ClaimModal () {
  const theme = useTheme();
  const { btnStyle } = theme;

  const { selectedModalData, selectedModal, closeModal, isModalLoading } = useClaimModal();
  const { account, library } = useWeb3React();
  const { withdrawRequests } = useWithdrawRequests()

  const [requests, setRequests] = useState()

  const [modalName, setModalName] = useState('')
  const [type, setType] = useState('main')
  const [number, setNumber] = useState(1)

  const [input, setInput] = useRecoilState(inputState);

  const closeThisModal = useCallback(() => {
    setInput('');
    setType('main')
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (selectedModalData) {
      setModalName(selectedModalData.name)
    }
  }, [type])

  
  return (
    <Modal
      isOpen={
        selectedModal === 'claim'
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
                  <ModalHeader
                    main={modalName}
                    sub={''}
                    closeThisModal={closeThisModal}
                    type={number}
                  />
                </Flex>
                <Flex bgColor={'#f4f6f8'} h={'1px'}  w={'100%'} />
                <Flex 
                  my={'45px'} 
                  flexDir={'column'} 
                  justifyContent={'center'} 
                  alignItems={'center'}
                  fontSize={'13px'}
                >
                  <Flex
                    fontWeight={500}
                    color={'#808992'}
                  >
                    Operator Manager Address
                  </Flex>
                  <Flex
                    color={'#2a72e5'}
                    fontWeight={500}
                    mb={'9px'}
                  >
                    0xaaaaa
                    {/* {selectedModalData.address} */}
                  </Flex>
                  <Flex
                    fontWeight={500}
                    fontSize={'21px'}
                    color={'#3e495c'}
                  >
                    100 TON
                  </Flex>
                  <Flex 
                    mt={'39px'}
                    fontSize={'13px'}
                    color={'#808992'}
                  >
                    {`Will transfer`}
                  </Flex>
                </Flex>
                <Flex bgColor={'#f4f6f8'} h={'1px'}  w={'100%'} />
              </Flex>
            </ModalBody>
          ): ''} 
        </ModalContent>
      </ModalOverlay>
      
    </Modal>
  )

}

export default ClaimModal