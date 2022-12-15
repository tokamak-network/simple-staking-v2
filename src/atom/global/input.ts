import { atom, selector } from 'recoil';
import { v1 } from 'uuid';

const inputState = atom({
  key: `inputValue/${v1()}`,
  default: '',
});

const inputBalanceState = selector({
  key: `inputBalanceValue/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const inputValueState = get(inputState);

    return inputValueState;
  },
});

export { inputState, inputBalanceState };
