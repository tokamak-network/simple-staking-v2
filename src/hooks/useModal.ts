import { defaultValue, inputState } from "atom/global/input";
import { modalData, modalLoadingState, modalState } from "atom/global/modal";
import React, { SetStateAction, useEffect } from "react";
import { useRecoilState } from "recoil";
import { ModalType } from "types/modal";

function useModal<T>(
  modalType?: ModalType,
  modalDataObj?: T | undefined,
  setInitialValue?: React.Dispatch<SetStateAction<any>>
) {
  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [selectedModalData, setSelectedModalData] = useRecoilState<
    T | undefined
  >(modalData);
  const [value, setValue] = useRecoilState(inputState);
  const [isModalLoading, setIsModalLoading] = useRecoilState(modalLoadingState);

  const openModal = () => {
    if (modalType) {
      setSelectedModal(modalType);
    }
    if (modalDataObj) {
      setSelectedModalData(modalDataObj);
    }
  };

  const closeModal = () => {
    setSelectedModal(undefined);
    setSelectedModalData(undefined);
    setValue(defaultValue);
    setIsModalLoading(false);
  };

  useEffect(() => {
    if (selectedModal) {
      setIsModalLoading(true);
      setTimeout(() => {
        setIsModalLoading(false);
      }, 2500);
    }
  }, [selectedModal, setIsModalLoading]);

  return {
    openModal,
    closeModal,
    selectedModal,
    selectedModalData,
    isModalLoading,
  };
}

export default useModal;
