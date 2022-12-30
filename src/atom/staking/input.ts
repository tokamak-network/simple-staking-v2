import { atom, selector } from "recoil";


//stake modal states
const stake_stakeModal_defaultValue = {
  stake_modal_balance: undefined,
};

const stake_stakeModal_input = atom({
  key: "stake_stakeModal_input",
  default: stake_stakeModal_defaultValue,
});

const stake_stakeModal_state = selector({
  key: "stake_stakeModal_input_state", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(stake_stakeModal_input);
    return selectedModalState;
  },
});

//unstake modal states
const stake_unstakeModal_defaultValue = {
  stake_unstakeModal_balance: undefined,
};

const stake_unstakeModal_input = atom({
  key: "stake_unstakeModal_input",
  default: stake_unstakeModal_defaultValue,
});

const stake_unstakeModal_state = selector({
  key: "stake_unstakeModal_input_state", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedModalState = get(stake_unstakeModal_input);
    return selectedModalState;
  },
});

//withdraw modal states
const stake_withdrawModal_defaultValue = {
  stake_withdrawModal_ltos_balance: undefined,
  stake_withdrawModal_tos_balance: undefined,
};

const stake_withdrawModal_inputState = atom<{
  stake_withdrawModal_ltos_balance: number | "" | undefined;
  stake_withdrawModal_tos_balance: number | "" | undefined;
}>({
  key: "stake_withdrawModal_input",
  default: stake_withdrawModal_defaultValue,
});

const stake_withdrawModal_state = selector({
  key: "stake_withdrawModal_input_state", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedInputState = get(stake_withdrawModal_inputState);
    return selectedInputState;
  },
});

//restake modal states
const stake_restakeModal_defaultValue = {
  stake_restakeModal_ltos_balance: undefined,
  stake_restakeModal_tos_balance: undefined,
};

const stake_restakeModal_inputState = atom({
  key: "stake_restakeModal_input",
  default: stake_restakeModal_defaultValue,
});

const stake_restakeModal_state = selector({
  key: "stake_restakeModal_input_state", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const selectedInputState = get(stake_restakeModal_inputState);
    return selectedInputState;
  },
});

export {
  stake_stakeModal_defaultValue,
  stake_stakeModal_input,
  stake_stakeModal_state,
  stake_unstakeModal_defaultValue,
  stake_unstakeModal_input,
  stake_unstakeModal_state,
  stake_withdrawModal_inputState,
  stake_withdrawModal_state,
  stake_withdrawModal_defaultValue,
  stake_restakeModal_defaultValue,
  stake_restakeModal_inputState,
  stake_restakeModal_state,
};
