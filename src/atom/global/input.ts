import { atom, selector } from "recoil";
import { v1 } from 'uuid';

const inputState = atom({
  key: `inputState/${v1()}`,
  default: '0',
});

const inputBalanceState = selector({
  key: `inputBalanceState/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(inputState);
    return selectedModalState;
  },
});

export { inputState, inputBalanceState };
