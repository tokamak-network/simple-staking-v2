import useInput from '@/hooks/useInput';
import useUserBalance from '@/hooks/useUserBalance';
import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, useTheme, Text } from '@chakra-ui/react';
import useModal from '@/hooks/useModal';
import { StakeCardProps } from '@/types/staking';
import { useCallback } from 'react';
import Image from "next/image";
import CLOSE_ICON from "assets/images/popup-close-icon.svg";


function StakeModal () {
  const theme = useTheme()

  const { selectedModalData, selectedModal, closeModal, isModalLoading } =
    useModal<StakeCardProps>();

  const { userTonBalance } = useUserBalance();
  const { inputValue, setValue, setResetValue } = useInput(
    "Staking_screen",
    "stake_modal"
  );

  const closeThisModal = useCallback(() => {
    setResetValue();
    closeModal();
  }, [setResetValue, closeModal]);

  return (
    <Modal
      isOpen={selectedModal === "stake_stake_modal"}
      isCentered
      onClose={closeThisModal}
    >
      <ModalOverlay>
        <ModalContent
          bg={'#fff'}
          minW={'350px'}
          borderRadius={'15px'}
          boxShadow={'0 2px 6px 0 rgba(61, 73, 93, 0.1)'}
        >
          <ModalBody>
            <Flex w="100%" flexDir={'column'}>
              <Flex pos={'relative'}>
                <Flex
                  pos={"absolute"}
                  right={"1.56em"}
                  cursor={"pointer"}
                  onClick={() => closeThisModal()}
                >
                  <Image src={CLOSE_ICON} alt={"CLOSE_ICON"}></Image>
                </Flex>
                <Text
                  color={"gray.800"}
                  fontSize={20}
                  fontWeight={600}
                >
                  Staking
                </Text>
                <Text
                  color={"gray.800"}
                  fontSize={20}
                  fontWeight={600}
                >
                  You can earn TON and Power
                </Text>
              </Flex>
              <Flex w={'350px'} borderY={'1px'} borderColor={'#f4f6f8'}>
                <Flex>
                  {/* input field */}
                </Flex>
                <Flex>
                  <Text>Ton Balance</Text>
                  <Text>Ton Balance</Text>
                  {/* balance field field */}
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
      
    </Modal>
  )
}

export default StakeModal