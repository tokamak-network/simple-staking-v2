import { atom, selector } from "recoil";
import { v1 } from 'uuid';

const defaultValue = {
  stake_stake_modal_period: 39312,
  stake_stake_modal_balance: "",
  stake_unstake_modal_balance: "",
};

const inputState = atom({
  key: `inputState/${v1()}`,
  default: defaultValue,
});

const inputBalanceState = selector({
  key: `inputBalanceState/${v1()}`, // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(inputState);
    return selectedModalState;
  },
});

export { inputState, inputBalanceState, defaultValue };
