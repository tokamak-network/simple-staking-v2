import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const txProcessState = atom({
  key: `txProcessState/${v1()}`,
  default: {
    hash: '',
    txType: '',
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
