import useInput from '@/hooks/useInput';
import useUserBalance from '@/hooks/useUserBalance';
import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, useTheme, Text, Button } from '@chakra-ui/react';
import useModal from '@/hooks/useModal';
import { StakeCardProps } from '@/types/staking';
import { useCallback } from 'react';
import Image from "next/image";
import CLOSE_ICON from "assets/images/popup-close-icon.svg";
import { BalanceInput } from '@/common/input/CustomInput';
import { getStakeModalComponent } from '../../../utils/getStakeModalComponent';


function StakeModal () {
  const theme = useTheme()

  const { selectedModalData, selectedModal, closeModal, isModalLoading } =
    useModal<StakeCardProps>();

  // const { userTonBalance } = useUserBalance();

  const { inputValue, setValue, setResetValue } = useInput(
    "Staking_screen",
    "stake_modal"
  );
  let modalComponent = undefined
  if (selectedModal && selectedModalData) {
    modalComponent = getStakeModalComponent(selectedModal, selectedModalData)
  }

  const closeThisModal = useCallback(() => {
    setResetValue();
    closeModal();
  }, [setResetValue, closeModal]);

  return (
    <Modal
      isOpen={selectedModal === "staking" || selectedModal === "unstaking" || selectedModal === "restaking" || selectedModal === "withdraw"}
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
          {modalComponent ?
            <ModalBody>
            <Flex w="100%" flexDir={'column'} alignItems={'center'} py={'20px'}>
              <Flex pos={'relative'} flexDir={'column'} alignItems={'center'}>
                <Flex
                  pos={"absolute"}
                  right={"-8em"}
                  top={'-60px'}
                  cursor={"pointer"}
                  onClick={() => closeThisModal()}
                >
                  <Image src={CLOSE_ICON} alt={"CLOSE_ICON"}></Image>
                </Flex>
                <Text
                  color={"gray.800"}
                  fontSize={'20px'}
                  fontWeight={'bold'}
                  h={"31px"}
                  mt={'6px'}
                >
                  {modalComponent.header}
                </Text>
                <Text
                  color={"#86929d"}
                  fontSize={'12px'}
                  fontWeight={'normal'}
                  mb={'20px'}
                >
                  {modalComponent.subHeader}
                </Text>
              </Flex>
              {/* modal body */}
              <Flex w={'350px'} borderY={'1px'} py={'14px'} borderColor={'#f4f6f8'} flexDir={'column'} alignItems={'center'}>
                <Flex h={'84px'} alignItems={'center'} flexDir={'row'} justifyContent={'center'} w={'100%'} >
                  <BalanceInput 
                    w={'220px'}
                    placeHolder={'0'}
                    maxValue={selectedModalData}
                  />
                  {/* input field */}
                </Flex>
                <Flex w={'100%'} flexDir={'column'} alignItems={'center'}>
                  <Text fontSize={'12px'} fontWeight={500} color={'#808992'}>{modalComponent.balanceInfo}</Text>
                  {/* @ts-ignore */}
                  <Text mt={'5px'}>{modalComponent.balance} TON</Text>
                </Flex>
              </Flex>
              {/* modal footer */}
              <Flex flexDir={'column'} alignItems={'center'}>
                <Text my={'25px'} color={'#2a72e5'} fontSize={'12px'} fontWeight={500}>
                  {modalComponent.bottomComment}
                </Text>
                <Button
                  w={'150px'}
                > 
                  {modalComponent.buttonName}
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
          : ''}
          
        </ModalContent>
      </ModalOverlay>
      
    </Modal>
  )
}

export default StakeModal