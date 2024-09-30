import { TxSort } from '@/types';
import { atom, selector } from 'recoil';
import { v1 } from 'uuid';
import { ethers } from "ethers";

const txState = atom({
  key: `txState/${v1()}`,
  default: false,
});

const txStatusState = selector({
  key: `txStatus/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const currentTxState = get(txState);

    return currentTxState;
  },
});

export { txState, txStatusState };

export const txHashStatus = atom<string | undefined>({
  key: "txHashStatus",
  default: undefined,
});

export const txHashLog = atom<{
  txSort: TxSort | undefined;
  logs: ethers.utils.Result | undefined;
}>({
  key: "txHashLog",
  default: {
    txSort: undefined,
    logs: undefined,
  },
});
