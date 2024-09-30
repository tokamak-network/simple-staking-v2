
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
// import "@/css/spinner.css";
import ConfirmedImage from "assets/images/modal/confirmed.svg";
import ErrorImage from "assets/images/modal/error.svg";
import Check from "assets/images/modal/check.svg";
import useTxConfirmModal from '@/hooks/useTxConfirmModal';
import { useRecoilValue } from 'recoil';
import { txHashLog } from '@/atom/global/transaction';

function ConfirmationTX () {
  const {
    isConfirmed,
    isConfirming,
    isError,
    isOpen,
    isClaimWaiting,
    closeModal,
  } = useTxConfirmModal();
  const txLog = useRecoilValue(txHashLog);
  const { selectedModalData, selectedModal, isModalLoading } = useModal();

  const closeThisModal = useCallback(() => {
    // setResetValue();
    
    closeModal();
  }, [ closeModal]);
  
  return (
    <Modal
      isOpen={
        selectedModal === 'staking' ||
        selectedModal === 'unstaking' ||
        selectedModal === 'restaking'
      } 
      isCentered
      onClose={closeThisModal}
    >

    </Modal>
  )
}

export default ConfirmationTX