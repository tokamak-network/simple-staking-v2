import { inputState } from "atom/global/input";
import { modalData, modalLoadingState, modalState } from "atom/global/modal";
import React, { SetStateAction, useEffect } from "react";
import { useRecoilState } from "recoil";
import { ModalType } from "types/modal";
import { ClaimModalDataType, StakeModalDataType } from "types";

function useClaimModal<T>(
	modalType?: ModalType,
	modalDataObj?: ClaimModalDataType | undefined,
	setInitialValue?: React.Dispatch<SetStateAction<any>>,
) {
	const [selectedModal, setSelectedModal] = useRecoilState(modalState);
	const [selectedModalData, setSelectedModalData] = useRecoilState<
		ClaimModalDataType | undefined
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
		setValue("");
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

export default useClaimModal;
