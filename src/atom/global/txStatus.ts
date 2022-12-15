import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const txProcessState = atom({
  key: `txProcessState/${v1()}`,
  default: {
    network: {},
    target: {},
    hash: '',
    targetHash: '',
    txType: '',
    processOnL1: false,
    waitFinalized: false,
    open: false,
  },
});

const txProcessStatusState = selector({
  key: `txStatus/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const currentTxState = get(txProcessState);

    return currentTxState;
  },
});

export { txProcessState, txProcessStatusState };
