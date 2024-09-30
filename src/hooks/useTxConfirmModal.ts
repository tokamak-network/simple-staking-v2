import {
  claimModalStatus,
  confirmWithdrawData,
  transactionModalOpenStatus,
  transactionModalStatus,
} from "@/atom/global/modal";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useToast } from "@chakra-ui/react";

export default function useTxConfirmModal() {
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  const [isOpen, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  
  const [claimModalState, setClaimModalState] =
    useRecoilState(claimModalStatus);
  const [, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const { closeAll } = useToast();

  const isConfirming = modalOpen === "confirming";
  const isConfirmed = modalOpen === "confirmed";
  const isError = modalOpen === "error";
  const isClaimWaiting = claimModalState === true;

  const closeModal = useCallback(() => {
    if (!isClaimWaiting) {
      setModalOpen(null);
      setIsOpen(false);
      setClaimModalState(false);
      setWithdrawData({
        modalData: null,
      });
      //close toast for transaction
      closeAll();
    }
  }, [setModalOpen, setIsOpen, isClaimWaiting, closeAll]);

  return {
    isOpen,
    setIsOpen,
    isConfirming,
    isConfirmed,
    isError,
    closeModal,
    setModalOpen,
    isClaimWaiting,
  };
}
