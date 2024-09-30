import { atom, selector } from 'recoil';
import { ModalType } from 'types/modal';
import { v1 } from 'uuid';

const modalState = atom<ModalType | undefined>({
  key: `modalType/${v1()}`,
  default: undefined,
});

const modalData = atom({
  key: `modalData/${v1()}`,
  default: {} as any | [] as any,
});

export const transactionModalStatus = atom<
  "confirming" | "confirmed" | "error" | null
>({
  key: "transactionModalStatus",
  default: null,
});

export const claimModalStatus = atom<boolean>({
  key: "claimModalStatus",
  default: false,
});
export const transactionModalOpenStatus = atom<boolean>({
  key: "transactionModalOpenStatus",
  default: false,
});

export const confirmModalStatus = atom<boolean>({
  key: "confirmModalStatus",
  default: false,
});
export const confirmWithdrawData = atom<any>({
  key: "confirmWithdrawData",
  default: {
    modalData: null,
  },
});

const selectedModalState = selector({
  key: `selectedModal/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(modalState);
    return selectedModalState;
  },
});

const selectedModalData = selector({
  key: `selectedModalData/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalData = get(modalData);
    return selectedModalState;
  },
});

const modalLoadingState = atom<boolean>({
  key: `modalLoadingState/${v1()}`,
  default: false,
});

const modalLoadingValue = selector({
  key: `modalLoadingValue/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const modalLoadingValue = get(modalLoadingState);
    return modalLoadingValue;
  },
});

export {
  modalState,
  modalData,
  selectedModalState,
  selectedModalData,
  modalLoadingState,
  modalLoadingValue,
};
